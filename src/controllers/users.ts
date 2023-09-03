import prisma from '../prisma';
import {Request, Response} from 'express';

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                profile: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true
                    }
                }
            }
        })
        return res.json(users);
    } catch(error) {
        return res.status(400).json(error);
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const {email, password, firstname, lastname} = req.body;

        const createdUser = await prisma.user.create({data: 
            {
                email,
                password,
                profile: {
                    create: {
                        firstname,
                        lastname
                    }
                }
            }
        });

        const completeUser = await prisma.user.findUnique({
            where: {
                id: createdUser.id
            },
            include: {
                profile: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                }
            }
        })

        console.log(createdUser)

        // create a default profile for each user

        return res.status(200).json(completeUser);
    } catch(error) {
        return res.status(500).json(error);
    }
}