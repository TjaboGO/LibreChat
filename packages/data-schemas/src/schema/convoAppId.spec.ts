import mongoose from 'mongoose';
import { tConversationSchema } from 'librechat-data-provider';
import convoSchema from './convo';

describe('convoSchema appId and session scoping (Fas 28)', () => {
  it('defines appId field with default "chat" and index true', () => {
    const appIdPath = convoSchema.path('appId');
    expect(appIdPath).toBeDefined();
    // In Mongoose SchemaType:
    expect((appIdPath as any).instance).toBe('String');
    expect((appIdPath as any).defaultValue).toBe('chat');
  });

  it('registers compound indexes for appId session scoping', () => {
    const indexes = convoSchema.indexes();
    const indexKeys = indexes.map((tuple) => tuple[0]);

    // Compound index for user + appId + updatedAt
    const hasUpdatedAtIndex = indexKeys.some(
      (idx) => idx.user === 1 && idx.appId === 1 && idx.updatedAt === -1 && idx._id === -1,
    );
    expect(hasUpdatedAtIndex).toBe(true);

    // Compound index for user + appId + createdAt
    const hasCreatedAtIndex = indexKeys.some(
      (idx) => idx.user === 1 && idx.appId === 1 && idx.createdAt === -1 && idx._id === -1,
    );
    expect(hasCreatedAtIndex).toBe(true);

    // Compound index for user + appId + isArchived + updatedAt
    const hasArchivedIndex = indexKeys.some(
      (idx) =>
        idx.user === 1 &&
        idx.appId === 1 &&
        idx.isArchived === 1 &&
        idx.updatedAt === -1 &&
        idx._id === -1,
    );
    expect(hasArchivedIndex).toBe(true);
  });

  it('defaults appId to "chat" on new model instances when not provided', () => {
    const ConvoModel =
      mongoose.models.ConvoAppIdTest || mongoose.model('ConvoAppIdTest', convoSchema);

    const defaultConvo: any = new ConvoModel({
      conversationId: 'convo-test-default',
      user: 'user-123',
    });

    expect(defaultConvo.appId).toBe('chat');
  });

  it('preserves explicitly supplied appId on new model instances', () => {
    const ConvoModel =
      mongoose.models.ConvoAppIdTest || mongoose.model('ConvoAppIdTest', convoSchema);

    const manusConvo: any = new ConvoModel({
      conversationId: 'convo-test-manus',
      user: 'user-123',
      appId: 'manus',
    });
    expect(manusConvo.appId).toBe('manus');

    const v0Convo: any = new ConvoModel({
      conversationId: 'convo-test-v0',
      user: 'user-123',
      appId: 'v0',
    });
    expect(v0Convo.appId).toBe('v0');

    const perplexityConvo: any = new ConvoModel({
      conversationId: 'convo-test-perplexity',
      user: 'user-123',
      appId: 'perplexity',
    });
    expect(perplexityConvo.appId).toBe('perplexity');
  });

  it('validates tConversationSchema default and custom appIds', () => {
    const parsedDefault = tConversationSchema.parse({
      conversationId: 'test-convo-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(parsedDefault.appId).toBe('chat');

    const parsedCustom = tConversationSchema.parse({
      conversationId: 'test-convo-id-2',
      appId: 'cursor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(parsedCustom.appId).toBe('cursor');
  });
});
