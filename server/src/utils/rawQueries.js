const tables = {
    Users: 'Users',
    Conversations: 'Conversations',
    GroupMembers: 'GroupMembers',
    Messages: 'Messages',
    Reaction: 'Reactions',
}

const queries = {
    chatsPreview:`
        SELECT 
            DISTINCT c.id AS conversationId,
            c.type AS conversationType,
            c.name AS conversationName,
            c.avatar AS conversationAvatar,
            GROUP_CONCAT(
                CONCAT(
                    '{',
                    CONCAT_WS(',',
                        CONCAT('"id":','"',u.id,'"'),
                        CONCAT('"firstName":','"',u.firstName,'"'),
                        CONCAT('"lastName":','"',u.lastName,'"'), 
                        CONCAT('"avatar":','"',u.avatar,'"')
                    ),
                    '}'
                )
                SEPARATOR '&&'
            ) as users,

            GROUP_CONCAT(
                CONCAT(
                    '{',
                        CONCAT_WS(',',
                            CONCAT('"id":','"',m.id,'"'),
                            CONCAT('"content":','"',m.content,'"'),
                            CONCAT('"from":','"',m.from,'"'), 
                            CONCAT('"type":','"',m.type,'"'),
                            CONCAT('"sentDateTime":','"',m.sentDateTime,'"'),
                            CONCAT('"deletedAt":','"',m.deletedAt,'"')
                        )
                      ,
                    '}'
                    )
                SEPARATOR '&&'
            ) as lastMessage

        FROM ${tables.Users} as u
        INNER JOIN ${tables.GroupMembers} as g_m ON u.id = g_m.userId
        INNER JOIN ${tables.Conversations} as c ON c.id = g_m.conversationId
        LEFT JOIN ${tables.Messages} as m ON m.conversationId = c.id
        AND
            m.id = (
                SELECT id from ${tables.Messages} 
                WHERE conversationId = c.id
                ORDER BY orderNumber DESC
                LIMIT 1
            )
            
        WHERE
            c.id IN (
                SELECT DISTINCT conversationId from ${tables.GroupMembers} where userId = :userId
            )
        AND
                u.id != :userId
        GROUP BY c.id
    `,

    messages: `
        SELECT 
            m.*,
            GROUP_CONCAT(
                CONCAT(
                    '{',
                    CONCAT_WS(',',
                        CONCAT('"id":','"',r.id,'"'),
                        CONCAT('"emoji":','"',r.emoji,'"'),
                        CONCAT('"from":','"',r.from,'"'),
                        CONCAT('"createdAt":','"',r.createdAt,'"')
                    ),
                    '}'
                )
                SEPARATOR '&&'
            ) as reactions

        from ${tables.Messages} m
        INNER JOIN ${tables.Conversations} c ON c.id = m.conversationId
        LEFT JOIN ${tables.Reaction} r ON r.messageId = m.id
        WHERE
            c.id = :conversationId
        GROUP BY m.id
        ORDER BY m.orderNumber DESC
        LIMIT :limit
        OFFSET :skip
    `,

    conversationByUserIds: `
                SELECT c.* FROM ${tables.Conversations} AS c
                WHERE
                    c.type = :type
                AND
                    c.id = (
                        SELECT conversationId FROM ${tables.GroupMembers}
                        WHERE userId IN (:myId, :otherId)
                        GROUP BY conversationId
                        HAVING COUNT(conversationId) >= 2
                    )
    `,

    findFriends: `
        SELECT u.id, CONCAT(u.firstName, ' ', u.lastName) as name, u.intro  FROM ${tables.Users} u
        WHERE
            u.email LIKE '%:search%'
        OR
            u.phoneNumber LIKE '%search%'
        OR
            firstName LIKE '%search%'
        OR
            lastName LIKE '%search%'
        LIMIT :limit
        OFFSET :offset
    `
} 

module.exports = queries;
