import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { NextApiRequest, NextApiResponse } from 'next';

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerAuthSession({ req, res });
    if (!session) {
        res.status(401).json({
            message: 'You must be signed in to view this content.',
        });
        return;
    }

    return res.json({
        message: 'Success',
    });
};

export default restricted;
