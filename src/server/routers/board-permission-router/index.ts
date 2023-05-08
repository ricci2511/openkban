import { Permission } from '@prisma/client';
import { notFound } from '@server/helpers/error-helpers';
import { adminBoardUserProcedure } from '@server/middlewares';
import { t } from '@server/trpc';
import { z } from 'zod';

export const boardPermissionRouter = t.router({
    update: adminBoardUserProcedure
        .input(
            z.object({
                memberPermission: z.object({
                    permission: z.nativeEnum(Permission),
                    access: z.boolean(),
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { boardId, memberPermission } = input;
            const { permission, access } = memberPermission;

            // if access is granted to the permission, create the permission
            if (access) {
                return await ctx.prisma.boardPermission.create({
                    data: {
                        memberPermissions: {
                            connect: {
                                boardId,
                            },
                        },
                        permission,
                    },
                });
            }

            // if access is denied, query the id of the member permission table the permission is in
            // and use it to delete the permission
            const memberPermissionId =
                await ctx.prisma.memberPermission.findFirst({
                    where: {
                        boardId,
                    },
                    select: {
                        id: true,
                    },
                });

            if (!memberPermissionId)
                throw notFound('Member permission id not found');

            return await ctx.prisma.boardPermission.delete({
                where: {
                    memberPermissionId_permission: {
                        memberPermissionId: memberPermissionId.id,
                        permission,
                    },
                },
            });
        }),
});
