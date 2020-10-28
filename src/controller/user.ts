import { Request, Response, NextFunction } from 'express';
import Friend from '../model/models/friend';
import WaitingFriend from '../model/models/waitingFriend';
import User from '../model/models/user';
import SharedSchedule from '../model/models/sharedSchedule';

interface Body {
  username: string;
  userId: string;
  friendId: number;
}

// 테스트 유저 추가
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body: Body = { ...req.body };
    const { username } = body;
    const newUser = await User.create({
      username,
    });
    res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    res.status(400).send('SignUp is failed.');
    next(e);
  }
};

// 유저 검색 (친구 추가)
export const searchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: {
        userId,
      },
      attributes: ['id', 'username', 'avatarUrl'],
    });
    user ? res.status(200).json(user) : res.status(400).send('No result.');
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

// 유저아이디 추가
export const addUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body: Body = { ...req.body };
    const { userId } = body;
    const { id } = req.user;
    const isExisted = await User.findOne({
      where: {
        userId,
      },
    });
    if (isExisted) {
      res.status(400).send('This userId was already existed.');
    } else {
      await User.update({ userId }, { where: { id } });
      res.status(200).json({ id, userId });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

// 유저네임 변경
export const changeUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body: Body = { ...req.body };
    const { username } = body;
    const { id } = req.user;
    await User.update({ username }, { where: { id } });
    res.status(200).json({ id, username });
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

// 유저의 정보 조회
export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: ['id', 'username', 'userId', 'avatarUrl'],
    });
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

// 친구 목록 (scope:followers)  ,  친구요청 받은 목록 (scope:applicants)
export const getFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { scope } = req.query;
    const { id } = req.user;
    const friends = await User.scope(`${scope}`).findByPk(id);
    res.json(friends);
  } catch (e) {
    next(e);
  }
};

// 친구 요청 보내기
export const requestFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body: Body = { ...req.body };
    const { friendId } = body;
    const { id } = req.user;
    const isExisted = await WaitingFriend.findOne({
      where: { applicant: friendId, receiver: id },
    });
    if (isExisted) {
      res.status(400).json('The request has already been executed.');
    } else {
      const resquestResult = await WaitingFriend.create({
        applicant: id,
        receiver: friendId,
      });
      res.status(201).json(resquestResult);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

// 친구요청 수락
export const acceptFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body: Body = { ...req.body };
    const { friendId } = body;
    const { id } = req.user;
    const destroyWaiting = WaitingFriend.destroy({
      where: {
        applicant: friendId,
        receiver: id,
      },
    });
    const createFriend1 = Friend.create({
      following: id,
      follower: friendId,
    });
    const createFriend2 = Friend.create({
      following: friendId,
      follower: id,
    });
    Promise.all([createFriend1, createFriend2, destroyWaiting]).then(result => {
      res.status(201).json(result);
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

// 친구요청 거절
export const rejectFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { friendId } = req.params;
    const { id } = req.user;
    await WaitingFriend.destroy({
      where: {
        applicant: Number(friendId),
        receiver: id,
      },
    });
    res.send(200).send('The rejection of the request has been completed.');
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

// 친구 삭제
export const breakFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { friendId } = req.params;
    const { id } = req.user;
    const deleteFriendPromise = Friend.destroy({
      where: {
        follower: Number(friendId),
        following: id,
      },
    });
    const deletedFriendPromise = Friend.destroy({
      where: {
        follower: id,
        following: friendId,
      },
    });
    const unShareSchedulePromise = SharedSchedule.destroy({
      where: {
        targetUser: friendId,
        shareUser: id,
      },
    });
    const unSharedSchedulePromise = SharedSchedule.destroy({
      where: {
        targetUser: id,
        shareUser: friendId,
      },
    });
    Promise.all([
      deleteFriendPromise,
      deletedFriendPromise,
      unShareSchedulePromise,
      unSharedSchedulePromise,
    ]).then(() => {
      res.status(200).send('Friend deletion was successful.');
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

// 회원 탈퇴
export const withdrawal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.user;
    await User.destroy({
      where: {
        id,
      },
    });
    res.status(200).send('delete!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    next(e);
  }
};

// 아바타 수정
export const changeAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payLoad = req.file.location;
    const { id } = req.user;
    User.update(
      {
        avartar_url: payLoad,
      },
      {
        where: {
          id,
        },
      }
    ).then(() => {
      res.status(200).send(payLoad);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
    next(err);
  }
};
