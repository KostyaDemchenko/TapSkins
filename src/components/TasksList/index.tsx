// Default import
import React, { useEffect, useState } from "react";

// Component import
import ProgressBar from "@/src/components/ProgressBar";
import { TaskCard } from "@/src/components/Carts";

// Style import
import "./style.scss";

interface Task {
  task_id: number;
  task_name: string;
  platform_type: string;
  reward_type: string;
  reward: number;
  link_to_join: string;
  social_icon: string;
}

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const completedTasks = 1; // Фиксированное значение для выполненных задач

  useEffect(() => {
    fetch("/api/task_store")
      .then((response) => response.json())
      .then((data) => setTasks(data.taskStoreDataStructured))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  return (
    <>
      <ProgressBar
        title='Tasks'
        total={tasks.length}
        completed={completedTasks}
      />
      <div className='tasks-list'>
        {tasks.map((task) => (
          <TaskCard key={task.task_id} task={task} />
        ))}
      </div>
    </>
  );
};

export default TasksList;
