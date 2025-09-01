export function generateTaskRichSnippet(tasks: any[]) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return {
    "@context": "https://schema.org",
    "@type": "Action",
    "name": "Task Management",
    "description": `Task management system with ${totalTasks} total tasks and ${completedTasks} completed (${progressPercentage}% progress)`,
    "result": {
      "@type": "QuantitativeValue",
      "value": progressPercentage,
      "unitText": "percent"
    },
    "object": {
      "@type": "CreativeWork",
      "name": "Personal Task List",
      "description": `User's task list containing ${totalTasks} tasks across multiple categories`
    }
  };
}

export function generateBreadcrumbs(currentPage = 'home') {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "TaskFlow",
        "item": "https://taskflow.app/"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": currentPage === 'home' ? 'Dashboard' : currentPage,
        "item": `https://taskflow.app/${currentPage === 'home' ? '' : currentPage}`
      }
    ]
  };
}

export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I add a new task in TaskFlow?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can add a new task by typing in the input field at the top of the app and pressing Enter, or use the keyboard shortcut Ctrl+N to quickly focus on the task input."
        }
      },
      {
        "@type": "Question",
        "name": "Can I organize tasks by categories?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! TaskFlow supports both default categories (Personal, Work, Shopping, Health, General) and custom categories with your own colors and icons."
        }
      },
      {
        "@type": "Question",
        "name": "Does TaskFlow send reminders for due tasks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, TaskFlow includes a smart notification system that sends browser notifications for upcoming and overdue tasks. You can customize reminder times in the settings."
        }
      },
      {
        "@type": "Question",
        "name": "Are there keyboard shortcuts available?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "TaskFlow includes comprehensive keyboard shortcuts: Ctrl+N for new tasks, / for search, Ctrl+A for select all, Ctrl+T for templates, and many more. Press ? to see the full list."
        }
      }
    ]
  };
}