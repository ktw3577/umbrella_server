import { Request, Response, NextFunction } from 'express';
import Schedule from '../model/models/schedule';
import User from '../model/models/user';
import Todo from '../model/models/todo';
import SharedSchedule from '../model/models/sharedSchedule';

interface Body {
  id: number;
  scheduleId: number;
  todos: any[];
  title: string;
  friendId: number;
}

export const getUserSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: Body = { ...req.body };
    const { id } = body;
    const schedules = await Schedule.findAll({
      where: { creator: id },
      include: [Todo],
    });
    res.status(200).json(schedules);
  } catch (e: any) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

export const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: Body = { ...req.body };
    const { id, todos, title } = body;
    const schedule = await Schedule.create({
      creator: id,
      title,
    });
    if (todos.length > 0) {
      const todosPromise = [];
      for (let i = 0; i < todos.length; i++) {
        todosPromise[i] = Todo.create({
          location: todos[i]['location'],
          date: todos[i]['date'],
          scheduleId: schedule.id,
        });
      }
      Promise.all(todosPromise).then(() => {
        res.status(200).json(schedule);
      });
    } else {
      res.status(400).send('Todos is empty.');
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

export const changeSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: Body = { ...req.body };
    const { scheduleId, todos, title } = body;
    const schedule = await Schedule.update(
      {
        title,
      },
      {
        where: { id: scheduleId },
      }
    );
    await Todo.destroy({
      where: { scheduleId },
    });

    if (todos.length > 0) {
      const todosPromise = [];
      for (let i = 0; i < todos.length; i++) {
        todosPromise[i] = Todo.create({
          location: todos[i]['location'],
          date: todos[i]['date'],
          scheduleId,
        });
      }
      Promise.all(todosPromise).then(() => {
        res.status(200).json(schedule);
      });
    } else {
      res.status(400).send('Todos is empty.');
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

export const shareSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: Body = { ...req.body };
    const { scheduleId, friendId, id } = body;
    const sharedSchedule = await SharedSchedule.create({
      targetUser: friendId,
      scheduleId,
      shareUser: id,
    });
    res.status(201).send(sharedSchedule);
  } catch (e: any) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

export const friendSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: Body = { ...req.body };
    const { id, friendId } = body;
    const sharedSchedules = await User.scope({
      method: ['complexFunction', friendId],
    }).findByPk(id);
    res.status(200).send(sharedSchedules);
  } catch (e: any) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

export const RemoveSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: Body = { ...req.body };
    const { id, scheduleId } = body;
    const deletedSchedule = await Schedule.destroy({
      where: { id: scheduleId, creator: id },
    });
    deletedSchedule
      ? res.status(200).send('The schedule has been deleted successfully.')
      : res.status(401).send('This is an unauthorized request.');
  } catch (e: any) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};
