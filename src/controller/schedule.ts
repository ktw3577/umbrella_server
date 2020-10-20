import { Request, Response, NextFunction } from 'express';
import Schedule from '../model/models/schedule';
import User from '../model/models/user';
import Todo from '../model/models/todo';
import SharedSchedule from '../model/models/sharedSchedule';

interface Body {
  scheduleId: number;
  todos: [];
  title: string;
  friendId: number;
  id: number;
}

export const getUserSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const schedules = await Schedule.findAll({
      where: { creator: id },
      include: [Todo],
    });
    res.status(200).json(schedules);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

export const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body: Body = { ...req.body };
    const { todos, title, id } = body;
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
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

export const changeSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body: Body = { ...req.body };
    const { scheduleId, todos, title, id } = body;
    const schedule = await Schedule.update(
      {
        title,
      },
      {
        where: { id: scheduleId, creator: id },
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
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

export const shareSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body: Body = { ...req.body };
    const { scheduleId, friendId, id } = body;
    const sharedSchedule = await SharedSchedule.create({
      targetUser: friendId,
      scheduleId,
      shareUser: id,
    });
    res.status(201).send(sharedSchedule);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

export const friendSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { friendId, id } = req.params;
    const sharedSchedules = await User.scope({
      method: ['complexFunction', friendId],
    }).findByPk(id);
    res.status(200).send(sharedSchedules);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

export const RemoveSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body: Body = { ...req.body };
    const { scheduleId, id } = body;
    const deletedSchedule = await Schedule.destroy({
      where: { id: scheduleId, creator: id },
    });
    deletedSchedule
      ? res.status(200).send('The schedule has been deleted successfully.')
      : res.status(401).send('This is an unauthorized request.');
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};
