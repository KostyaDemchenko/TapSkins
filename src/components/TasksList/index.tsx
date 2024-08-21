import React, { useEffect, useState } from "react";

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

interface TasksResponse {
  unCompletedTasks: TaskProps[];
  tasks: {
    completed: number;
    total: number;
  };
}

const TasksList: React.FC<{ user: User }> = ({ user }) => {
  const [tasks, setTasks] = useState<TasksResponse>({
    unCompletedTasks: [],
    tasks: {
      completed: 0,
      total: 0,
    },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<TaskProps | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

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
  }, []);

  const handleTaskClick = async (task: TaskProps) => {
    const completeStatus = await user.completeTask(task.task_id);
    console.log("Complete status:", completeStatus);
    if (task.platform_type === "Telegram") {
      // тут записываем в localstorage что был кликнут таск с тг
      let tgTasks: (string | number[]) = global.window.localStorage.getItem("tgTasks") as string;
      if (tgTasks) tgTasks = JSON.parse(tgTasks) as number[];
      else tgTasks = [] as number[];
      tgTasks.push(task.task_id);
      window.localStorage.setItem("tgTasks", JSON.stringify(tgTasks));
    }
    const completedTask = await user.getRewardsForCompletedTasks();
    const rewards = completedTask.rewardsClaimed;


    if (rewards.purple || rewards.yellow) {
      setSelectedTask(task);
      setShowModal(true);
      // если награда получена, но платформа не тг
      if (task.platform_type === "Any") window.open(task.link_to_join, "_blank");
    }
    else {
      // если награда не получена еще
      window.open(task.link_to_join, "_blank");
    }
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
              lastTimeClicked={formatDate(user.last_daily_bonus_time_clicked)}
              // lastTimeClicked={"05-08-2024 00:00:00"}
              user={user}
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
          : tasks.unCompletedTasks.map((task) => {
            let tgTasks: string | null | number[] = global.window.localStorage.getItem("tgTasks");
            if (tgTasks) tgTasks = JSON.parse(tgTasks);
            return <TaskCard
              key={task.task_id}
              task={task}
              // если находим в localstorage запись о том что уже кликнули по таске, то 
              // вешаем класс, который отобразит типа кнопку "Проверить"
              className={tgTasks ? (tgTasks as number[]).find(el => el === task.task_id) ? "tg-status-check" : "" : ""}
              onClick={() => handleTaskClick(task)}
              id={`rewardTrigger-${task.task_id}`}
            />
          })}
      </div>
      {selectedTask && (
        <RewardModal
          triggerId={`rewardTrigger-${selectedTask.task_id}`}
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          rewardAmount={selectedTask.reward}
          rewardName={selectedTask.task_name}
          rewardType={selectedTask.reward_type}
        />
      )}
    </>
  );
};

export default TasksList;
