// Default import
import React, { useEffect, useState } from "react";

// Component import
import ProgressBar from "@/src/components/ProgressBar";
import { TaskCard } from "@/src/components/Carts";
import Skeleton from "@mui/material/Skeleton";
import RewardModal from "@/src/components/RevardModal";

// Style import
import "./style.scss";

interface Task {
  task_id: number;
  task_name: string;
  platform_type: string;
  reward_type: "purple_coin" | "yellow_coin"; // Уточняем типы
  reward: number;
  link_to_join: string;
  social_icon: string;
}

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/task_store");
        const data = await response.json();
        setTasks(data.taskStoreDataStructured);
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

  const handleTaskClick = (task: Task) => {
    if (task.platform_type === "Telegram") {
      const formattedLink = task.link_to_join.replace("https://t.me/", "@");
      console.log(`Join Telegram channel: ${formattedLink}`);
      // Здесь можно добавить любую другую логику, необходимую для обработки клика
    } else {
      window.location.href = task.link_to_join;
    }

    setSelectedTask(task);
  };

  return (
    <>
      <ProgressBar
        titleVisible={true}
        title='Tasks'
        total={tasks.length}
        completed={1} // Можно заменить на переменную, которая считает завершенные задачи
        isLoading={loading} // Передаем состояние загрузки
      />
      <div className='tasks-list'>
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
          : tasks.map((task) => (
              <TaskCard
                key={task.task_id}
                task={task}
                onClick={() => handleTaskClick(task)}
                id={`rewardTrigger-${task.task_id}`}
              />
            ))}
      </div>
      {selectedTask && (
        <RewardModal
          triggerId={`rewardTrigger-${selectedTask.task_id}`}
          rewardAmount={selectedTask.reward}
          rewardName={selectedTask.task_name}
          rewardType={selectedTask.reward_type}
        />
      )}
    </>
  );
};

export default TasksList;
