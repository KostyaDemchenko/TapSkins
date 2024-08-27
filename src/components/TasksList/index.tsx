import React, { useEffect, useRef, useState } from "react";

// Component import
import ProgressBar from "@/src/components/ProgressBar";
import { TaskCard } from "@/src/components/Carts";
import DailyReward from "@/src/components/DailyReward";
import Skeleton from "@mui/material/Skeleton";
import RewardModal from "@/src/components/RevardModal";

// Style import
import "./style.scss";

import { TaskProps, User } from "@/src/utils/types";
import { formatDate } from "@/src/utils/functions";
import {
  Id,
  ToastContainer,
  ToastOptions,
  TypeOptions,
  UpdateOptions,
  toast,
} from "react-toastify";

interface TasksResponse {
  unCompletedTasks: TaskProps[] | null;
  tasks: {
    completed: number;
    total: number;
  };
}

const toastSettings: ToastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const toastReceivedSettings = (
  type: TypeOptions,
  text: string
): UpdateOptions => {
  return {
    render: text,
    isLoading: false,
    type: type,
    pauseOnHover: true,
    closeOnClick: true,
    autoClose: 3000,
  };
};

const TasksList: React.FC<{ user: User }> = ({ user }) => {
  const [tasks, setTasks] = useState<TasksResponse>({
    unCompletedTasks: null,
    tasks: {
      completed: 0,
      total: 0,
    },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<TaskProps | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [lastDailyClick, setLastDailyClick] = useState<string>(
    formatDate(user.last_daily_bonus_time_clicked)
  ); // Добавлено состояние для отслеживания последнего клика

  const toasterId = useRef<Id>();
  const [isClaimingReward, setIsClaimingReward] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await user.getTasks();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchTasks();
  }, [lastDailyClick]); // Обновляем задачи при изменении lastDailyClick

  // удаляем из локального хранилища таски, которых нету
  useEffect(() => {
    if (tasks.unCompletedTasks) {
      const localStorage = global.window.localStorage.getItem("tgTasks");
      if (!localStorage) return;

      try {
        const parsedStor = JSON.parse(localStorage) as number[];
        if (!parsedStor.length) return;

        console.log(parsedStor, tasks.unCompletedTasks);
        const actualIds = parsedStor.filter((id) => {
          return tasks.unCompletedTasks!.find((el) => el.task_id === id);
        });

        global.window.localStorage.setItem(
          "tgTasks",
          JSON.stringify(actualIds)
        );
      } catch (error) {
        console.error("Something wrong with local storage");
      }
    }
  }, [tasks]);

  const handleTaskClick = async (task: TaskProps) => {
    if (isClaimingReward) return;
    setIsClaimingReward(true);
    toasterId.current = toast.loading("Checking for reward...", toastSettings);
    const completeStatus = await user.completeTask(task.task_id);

    if (!completeStatus.success) {
      console.error(completeStatus.details);
      toast.update(
        toasterId.current,
        toastReceivedSettings("error", "Some error occured")
      );
      return;
    }

    //* таска телеграм
    if (task.platform_type === "Telegram") {
      // вернет по сути, есть ли уже награда за подписку на тг канал
      const completedTask = await user.getRewardsForCompletedTasks();
      const reward = completedTask.rewardsClaimed;

      // тут записываем в localstorage что был кликнут таск с тг
      let tgTasks: string | number[] = global.window.localStorage.getItem(
        "tgTasks"
      ) as string;
      if (tgTasks) tgTasks = JSON.parse(tgTasks) as number[];
      else tgTasks = [] as number[];
      const taskIndex = tgTasks.findIndex((el) => el === task.task_id);
      if (reward.purple || reward.yellow) {
        // значит подписка была сделана, показываем модалку, награда получена
        toast.done(toasterId.current);
        setIsClaimingReward(false);
        setSelectedTask(task);
        setShowModal(true);

        if (tgTasks.length && tgTasks.find((el) => el === task.task_id)) {
          // удаляем из локального хранилища таску
          if (taskIndex === -1) return;
          tgTasks.splice(taskIndex, 1);
          window.localStorage.setItem("tgTasks", JSON.stringify(tgTasks));
        }
        return;
      }
      if (taskIndex === -1) tgTasks.push(task.task_id);
      window.localStorage.setItem("tgTasks", JSON.stringify(tgTasks));

      window.open(task.link_to_join, "_blank");
      setIsClaimingReward(false);
      toast.update(toasterId.current, {
        ...toastReceivedSettings("info", "Check subscription again"),
      });
      return;
    }
    //* таска не телеграммная
    const completedTask = await user.getRewardsForCompletedTasks();
    const rewards = completedTask.rewardsClaimed;

    if (rewards.purple || rewards.yellow) {
      toast.done(toasterId.current);
      setSelectedTask(task);
      setShowModal(true);
      setIsClaimingReward(false);
      window.open(task.link_to_join, "_blank");
    } else {
      toast.update(
        toasterId.current,
        toastReceivedSettings("error", "Some error occured!")
      );
    }
    setIsClaimingReward(false);
  };

  return (
    <>
      <ProgressBar
        titleVisible={true}
        title='Tasks'
        total={tasks.tasks.total}
        completed={tasks.tasks.completed} // Можно заменить на переменную, которая считает завершенные задачи
        isLoading={loading} // Передаем состояние загрузки
      />
      <div className='tasks-list'>
        {loading ? (
          <Skeleton
            variant='rounded'
            height={84}
            animation='wave'
            sx={{
              bgcolor: "var(--color-surface)",
              marginBottom: "5px",
              width: "100%",
            }}
          />
        ) : (
          user && (
            <DailyReward
              lastTimeClicked={lastDailyClick} // Используем состояние
              user={user}
              onRewardClaimed={(newLastClick) =>
                setLastDailyClick(newLastClick)
              } // Обновляем состояние при получении награды
            />
          )
        )}
        {loading
          ? Array.from(new Array(5)).map((_, index) => (
              <Skeleton
                key={index}
                variant='rounded'
                height={84}
                animation='wave'
                sx={{
                  bgcolor: "var(--color-surface)",
                  marginBottom: "5px",
                  width: "100%",
                }}
              />
            ))
          : (tasks.unCompletedTasks ? tasks.unCompletedTasks : []).map(
              (task) => {
                let tgTasks: string | null | number[] =
                  global.window.localStorage.getItem("tgTasks");
                if (tgTasks) tgTasks = JSON.parse(tgTasks);
                return (
                  <TaskCard
                    key={task.task_id}
                    task={task}
                    // если находим в localstorage запись о том что уже кликнули по таске, то
                    // вешаем класс, который отобразит типа кнопку "Проверить"
                    className={
                      tgTasks
                        ? (tgTasks as number[]).find(
                            (el) => el === task.task_id
                          )
                          ? "tg-status-check"
                          : ""
                        : ""
                    }
                    onClick={() => handleTaskClick(task)}
                    id={`rewardTrigger-${task.task_id}`}
                  />
                );
              }
            )}
      </div>
      {selectedTask && (
        <RewardModal
          triggerId={`rewardTrigger-${selectedTask.task_id}`}
          isVisible={showModal}
          onClose={() => {
            if (!tasks.unCompletedTasks) return;
            setShowModal(false);
            const index = tasks.unCompletedTasks.findIndex(
              (el) => el.task_id === selectedTask.task_id
            );
            if (index !== -1) {
              tasks.unCompletedTasks.splice(index, 1);
              tasks.tasks.completed += 1;
              setTasks({ ...tasks });
            }
            setSelectedTask(null);
          }}
          rewardAmount={selectedTask.reward}
          rewardName={selectedTask.task_name}
          rewardType={selectedTask.reward_type}
        />
      )}
    </>
  );
};

export default TasksList;
