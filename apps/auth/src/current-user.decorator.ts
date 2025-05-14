import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './users/user.schema';

export const getCurrentUserByContext = (
  context: ExecutionContext,
): User | null => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user;
  }

  return null;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
