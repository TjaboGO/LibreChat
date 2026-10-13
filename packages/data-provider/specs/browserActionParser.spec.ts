import {
  smartResize,
  roundByFactor,
  extractPointCoordinates,
  extractBoxCoordinates,
  scaleCoordinatesToViewport,
  parseMRPLoop,
  parseUITarsAction,
  convertUITarsActionToPlaywright,
  parseIndexedElementTree,
} from '../src/browser/actionParser';

describe('Browser Action Parser & UI-TARS Grounding', () => {
  describe('smartResize', () => {
    it('rounds numbers to nearest factor', () => {
      expect(roundByFactor(29, 28)).toBe(28);
      expect(roundByFactor(45, 28)).toBe(56);
    });

    it('rounds dimensions to multiples of factor (28)', () => {
      const resized = smartResize({ width: 1920, height: 1080 });
      expect(resized.width % 28).toBe(0);
      expect(resized.height % 28).toBe(0);
      expect(resized.width * resized.height).toBeGreaterThanOrEqual(100 * 28 * 28);
      expect(resized.width * resized.height).toBeLessThanOrEqual(16384 * 28 * 28);
    });

    it('rejects extreme aspect ratios above MAX_RATIO (200)', () => {
      expect(() => {
        smartResize({ width: 10000, height: 10 });
      }).toThrow(/Aspect ratio must be smaller than 200/);
    });

    it('scales small images up to minPixels', () => {
      const resized = smartResize({ width: 50, height: 50 });
      expect(resized.width * resized.height).toBeGreaterThanOrEqual(100 * 28 * 28);
      expect(resized.width % 28).toBe(0);
      expect(resized.height % 28).toBe(0);
    });
  });

  describe('extractPointCoordinates', () => {
    it('extracts point from <point> tag', () => {
      const pt = extractPointCoordinates('<point>125 450</point>');
      expect(pt).toEqual({ x: 125, y: 450 });
    });

    it('extracts point from tuple (x, y)', () => {
      const pt = extractPointCoordinates('(300, 600)');
      expect(pt).toEqual({ x: 300, y: 600 });
    });

    it('returns null for empty or invalid string', () => {
      expect(extractPointCoordinates('')).toBeNull();
      expect(extractPointCoordinates('no coordinates here')).toBeNull();
    });
  });

  describe('extractBoxCoordinates', () => {
    it('extracts box from <bbox> tag', () => {
      const box = extractBoxCoordinates('<bbox>100 200 300 400</bbox>');
      expect(box).toEqual({ x1: 100, y1: 200, x2: 300, y2: 400 });
    });

    it('extracts box from comma-separated tuple', () => {
      const box = extractBoxCoordinates('[50, 100, 150, 200]');
      expect(box).toEqual({ x1: 50, y1: 100, x2: 150, y2: 200 });
    });
  });

  describe('scaleCoordinatesToViewport', () => {
    it('scales 0..1000 normalized coordinates to 1280x720', () => {
      const scaled = scaleCoordinatesToViewport(
        { x: 500, y: 500 },
        { width: 1000, height: 1000 },
        { width: 1280, height: 720 },
      );
      expect(scaled).toEqual({ x: 640, y: 360 });
    });

    it('scales float 0..1 coordinates to 1280x720', () => {
      const scaled = scaleCoordinatesToViewport(
        { x: 0.25, y: 0.5 },
        { width: 1, height: 1 },
        { width: 1280, height: 720 },
      );
      expect(scaled).toEqual({ x: 320, y: 360 });
    });
  });

  describe('parseMRPLoop', () => {
    it('parses Reflection + Action_Summary + Action format', () => {
      const text = `Reflection: The search results loaded successfully.
Action_Summary: Click on the first search result link.
Action: click(point='<point>200 350</point>')`;

      const parsed = parseMRPLoop(text);
      expect(parsed.reflection).toBe('The search results loaded successfully.');
      expect(parsed.actionSummary).toBe('Click on the first search result link.');
      expect(parsed.action).toBe("click(point='<point>200 350</point>')");
    });

    it('parses Thought + Action format', () => {
      const text = `Thought: I need to enter the user name in the text field.
Action: type(content='Gabriel\\n')`;

      const parsed = parseMRPLoop(text);
      expect(parsed.rawThought).toBe('I need to enter the user name in the text field.');
      expect(parsed.action).toBe("type(content='Gabriel\\n')");
    });
  });

  describe('parseUITarsAction', () => {
    it('parses click with point', () => {
      const action = parseUITarsAction("click(point='<point>150 250</point>')");
      expect(action).not.toBeNull();
      expect(action?.function).toBe('click');
      expect(action?.args.point).toBe('<point>150 250</point>');
    });

    it('parses type with escaped newlines and single quotes', () => {
      const action = parseUITarsAction("type(content='Gabriel\\'s Project\\n')");
      expect(action).not.toBeNull();
      expect(action?.function).toBe('type');
      expect(action?.args.content).toBe("Gabriel's Project\n");
    });

    it('parses hotkey action', () => {
      const action = parseUITarsAction("hotkey(key='ctrl c')");
      expect(action?.function).toBe('hotkey');
      expect(action?.args.key).toBe('ctrl c');
    });

    it('parses finished action', () => {
      const action = parseUITarsAction("finished(content='Found 5 laptops under $1000')");
      expect(action?.function).toBe('finished');
      expect(action?.args.content).toBe('Found 5 laptops under $1000');
    });
  });

  describe('convertUITarsActionToPlaywright', () => {
    it('converts click(point) to browser_mouse_click_xy with scaled coordinates', () => {
      const parsed = parseUITarsAction("click(point='<point>500 500</point>')")!;
      const mapping = convertUITarsActionToPlaywright(
        parsed,
        { width: 1000, height: 1000 },
        { width: 1280, height: 720 },
      );
      expect(mapping.tool).toBe('browser_mouse_click_xy');
      expect(mapping.parameters).toEqual({ x: 640, y: 360, button: 'left', clickCount: 1 });
    });

    it('converts type(content) with newline to browser_type with submit=true', () => {
      const parsed = parseUITarsAction("type(content='test search\\n')")!;
      const mapping = convertUITarsActionToPlaywright(parsed);
      expect(mapping.tool).toBe('browser_type');
      expect(mapping.parameters.text).toBe('test search');
      expect(mapping.parameters.submit).toBe(true);
    });

    it('converts scroll to browser_mouse_wheel', () => {
      const parsed = parseUITarsAction("scroll(point='<point>100 100</point>', direction='down')")!;
      const mapping = convertUITarsActionToPlaywright(parsed);
      expect(mapping.tool).toBe('browser_mouse_wheel');
      expect(mapping.parameters.deltaY).toBe(500);
    });

    it('converts finished to done action', () => {
      const parsed = parseUITarsAction("finished(content='Done')")!;
      const mapping = convertUITarsActionToPlaywright(parsed);
      expect(mapping.tool).toBe('done');
      expect(mapping.parameters.success).toBe(true);
      expect(mapping.parameters.text).toBe('Done');
    });
  });

  describe('parseIndexedElementTree', () => {
    it('parses regular and newly appeared elements from Browser-Use formatted tree', () => {
      const tree = `
[1]<div class="container" />
  [2]<input type="text" placeholder="Enter name" name="username" />
  *[3]<button type="submit" aria-label="Submit Form" />
  |SHADOW(open)|[4]<input type="search" />
  |scroll element[5]<div class="scroll-area" />
`;
      const elements = parseIndexedElementTree(tree);
      expect(elements).toHaveLength(5);

      expect(elements[0].index).toBe(1);
      expect(elements[0].tagName).toBe('div');
      expect(elements[0].isNew).toBe(false);

      expect(elements[1].index).toBe(2);
      expect(elements[1].tagName).toBe('input');
      expect(elements[1].attributes.placeholder).toBe('Enter name');

      expect(elements[2].index).toBe(3);
      expect(elements[2].isNew).toBe(true); // marked with *
      expect(elements[2].tagName).toBe('button');

      expect(elements[3].index).toBe(4);
      expect(elements[3].inShadowDom).toBe(true);

      expect(elements[4].index).toBe(5);
      expect(elements[4].isScrollable).toBe(true);
    });
  });
});
