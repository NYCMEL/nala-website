(function () {
  'use strict';

  window.NalameConfig = {
    app: {
      name: 'nalame',
      title: 'Locksmith Career Path',
      eyebrow: 'Personalized Flow',
      intro: 'Answer a few quick questions to help us understand your goals.',
      modeLabel: 'Theme',
      lightLabel: 'Light',
      darkLabel: 'Dark',
      defaultTheme: 'light',
      summaryTitle: 'Your Personalized Locksmith Path',
      summaryIntro: 'Review your answers and see the path that fits your goals.',
      emptyAnswerLabel: 'Skipped',
      restartLabel: 'Start Over',
      progressLabel: 'Question',
      previousLabel: 'Previous',
      nextLabel: 'Next',
      skipLabel: 'Skip',
      completeLabel: 'Complete',
      requiredMessage: 'Choose an answer or skip this question.',
      ariaLive: 'Quiz status updates',
      answerGroupLabel: 'Answer choices',
      summaryAriaLabel: 'Completed quiz answers'
    },
    questionMedia: {},
    questions: [
      {
        id: 'question-01',
        text: 'What best describes your current work situation?',
        conversation: 'Let us start with where you are today.',
        answers: [
          { id: 'q01-a01', text: 'Working full-time', conversation: 'That is helpful. Many people begin building a new skill while still working full-time.' },
          { id: 'q01-a02', text: 'Working part-time', conversation: 'Good to know. A part-time schedule may give you room to build momentum.' },
          { id: 'q01-a03', text: 'Self-employed', conversation: 'Great. You may already understand independence, clients, and creating your own path.' },
          { id: 'q01-a04', text: 'Between jobs', conversation: 'Understood. This can be a good time to explore a practical skill with real-world demand.' },
          { id: 'q01-a05', text: 'Student', conversation: 'Nice. Learning a useful trade early can open more options for your future.' },
          { id: 'q01-a06', text: 'Retired', conversation: 'Good to know. A flexible skill can still create useful options on your terms.' }
        ]
      },
      {
        id: 'question-02',
        text: 'What made you decide to explore new opportunities today?',
        conversation: 'Now let us understand what is motivating you.',
        answers: [
          { id: 'q02-a01', text: 'Need more money', conversation: 'Good to know. Let us dig in a little more and understand what kind of opportunity would really help.' },
          { id: 'q02-a02', text: 'Looking for flexibility', conversation: 'Flexibility matters. Let us explore what a better schedule could look like for you.' },
          { id: 'q02-a03', text: 'Want a career change', conversation: 'A career change can feel big, but a clear path makes it easier to start.' },
          { id: 'q02-a04', text: 'Need more stability', conversation: 'Stability is a strong reason to explore a practical skill.' },
          { id: 'q02-a05', text: 'Just curious', conversation: 'Curiosity is a great first step. Let us see if this path feels like a fit.' }
        ]
      },
      {
        id: 'question-03',
        text: 'If nothing changed over the next 12 months, how would you feel?',
        conversation: 'That gives us a sense of how important change feels right now.',
        answers: [
          { id: 'q03-a01', text: 'Frustrated', conversation: 'That is understandable. Frustration often means you are ready to look at better options.' },
          { id: 'q03-a02', text: 'Disappointed', conversation: 'That tells us this matters to you. Let us keep going.' },
          { id: 'q03-a03', text: 'Neutral', conversation: 'Fair enough. Sometimes the right opportunity becomes clearer as you compare your options.' },
          { id: 'q03-a04', text: 'Fine', conversation: 'Good to know. You may be looking more for growth than escape.' },
          { id: 'q03-a05', text: 'Happy', conversation: 'That is great. Let us see whether locksmithing could still add flexibility or new income options.' }
        ]
      },
      {
        id: 'question-04',
        text: 'Imagine it is one year from today. What is the biggest improvement you would like to see?',
        conversation: 'That future picture is important. Let us make it more specific.',
        answers: [
          { id: 'q04-a01', text: 'Higher income', conversation: 'A clear income goal can help you focus on practical skills that create opportunity.' },
          { id: 'q04-a02', text: 'Better schedule', conversation: 'Schedule control is a powerful reason to learn a skilled trade.' },
          { id: 'q04-a03', text: 'Less stress', conversation: 'Less stress can make a big difference in daily life. Let us keep narrowing your best path.' },
          { id: 'q04-a04', text: 'More independence', conversation: 'Independence is one of the reasons many people are attracted to locksmithing.' },
          { id: 'q04-a05', text: 'Stronger job security', conversation: 'Security matters. Skilled trades can offer a practical way to build long-term value.' }
        ]
      },
      {
        id: 'question-05',
        text: 'How satisfied are you with your current income and career path?',
        conversation: 'Thanks for being honest. This helps us understand how much change you may be looking for.',
        answers: [
          { id: 'q05-a01', text: '1 - Not satisfied', conversation: 'It sounds like there is real room for improvement. Let us keep going.' },
          { id: 'q05-a02', text: '2', conversation: 'That tells us change may be important right now.' },
          { id: 'q05-a03', text: '3', conversation: 'Good to know. You may be looking for a more practical path forward.' },
          { id: 'q05-a04', text: '4', conversation: 'Thanks. Let us see what kind of improvement matters most.' },
          { id: 'q05-a05', text: '5', conversation: 'You may be in the middle. Let us explore what would make things better.' },
          { id: 'q05-a06', text: '6', conversation: 'Good. There may still be room for more flexibility or growth.' },
          { id: 'q05-a07', text: '7', conversation: 'That is a solid starting point. Let us see what kind of upside interests you.' },
          { id: 'q05-a08', text: '8', conversation: 'Nice. You may be exploring this for opportunity rather than urgency.' },
          { id: 'q05-a09', text: '9', conversation: 'Great. Let us see if locksmithing fits your longer-term goals.' },
          { id: 'q05-a10', text: '10 - Very satisfied', conversation: 'Excellent. Many satisfied people still explore skilled trades for independence and options.' }
        ]
      },
      {
        id: 'question-06',
        text: 'What monthly income would make you feel financially comfortable?',
        conversation: 'Now let us understand the level of opportunity you are aiming for.',
        answers: [
          { id: 'q06-a01', text: '$4,000+', conversation: 'That is a practical goal for many people starting a new path.' },
          { id: 'q06-a02', text: '$6,000+', conversation: 'That kind of goal can create meaningful breathing room.' },
          { id: 'q06-a03', text: '$8,000+', conversation: 'That is a strong target. Let us see how serious you are about building toward it.' },
          { id: 'q06-a04', text: '$10,000+', conversation: 'That is an ambitious goal. A skill plus a clear plan becomes especially important.' },
          { id: 'q06-a05', text: '$12,000+', conversation: 'That is a big vision. Let us understand what would support that kind of path.' }
        ]
      },
      {
        id: 'question-07',
        text: 'What appeals most to you about locksmithing?',
        conversation: 'Great. This helps us understand what part of the profession connects with you personally.',
        answers: [
          { id: 'q07-a01', text: 'Helping people', conversation: 'That is one of the most meaningful parts of the work, especially in stressful moments.' },
          { id: 'q07-a02', text: 'Working with my hands', conversation: 'Hands-on work can be very rewarding, especially when you can see the result immediately.' },
          { id: 'q07-a03', text: 'Starting a business', conversation: 'That is a strong reason. Locksmithing can connect skill-building with business opportunity.' },
          { id: 'q07-a04', text: 'Flexible schedule', conversation: 'Flexibility is a major motivator. Let us see how well this path fits your life.' },
          { id: 'q07-a05', text: 'Learning a valuable skill', conversation: 'A useful skill can stay with you for years.' },
          { id: 'q07-a06', text: 'A career less impacted by AI', conversation: 'That is smart thinking. Real-world skilled trades are harder to replace with software alone.' }
        ]
      },
      {
        id: 'question-08',
        text: 'Have you ever considered owning your own business?',
        conversation: 'Let us look at whether independence is part of your long-term picture.',
        answers: [
          { id: 'q08-a01', text: 'Already own one', conversation: 'Great. You may already have the mindset needed to turn a skill into a service.' },
          { id: 'q08-a02', text: 'Yes', conversation: 'That is exciting. A skilled trade can be one practical route toward independence.' },
          { id: 'q08-a03', text: 'Maybe', conversation: 'That is completely fine. Sometimes confidence grows once the roadmap becomes clearer.' },
          { id: 'q08-a04', text: 'No', conversation: 'No problem. Many people prefer employment or side income before thinking about ownership.' }
        ]
      },
      {
        id: 'question-09',
        text: 'How much time can you realistically dedicate each week to learning a new skill?',
        conversation: 'Consistency matters more than trying to do everything at once.',
        answers: [
          { id: 'q09-a01', text: '2-4 hours', conversation: 'That is enough to start building momentum without overwhelming your schedule.' },
          { id: 'q09-a02', text: '5-8 hours', conversation: 'Great. That gives you a solid weekly rhythm for learning.' },
          { id: 'q09-a03', text: '8-12 hours', conversation: 'Strong commitment. You could make meaningful progress with that level of focus.' },
          { id: 'q09-a04', text: '12+ hours', conversation: 'Excellent. That shows you may be ready to move quickly and stay focused.' }
        ]
      },
      {
        id: 'question-10',
        text: 'What is your biggest challenge right now?',
        conversation: 'Knowing the obstacle helps us understand what support matters most.',
        answers: [
          { id: 'q10-a01', text: 'Time', conversation: 'Time is real. The right plan should fit into your life, not overwhelm it.' },
          { id: 'q10-a02', text: 'Money', conversation: 'That is understandable. Let us keep looking at what would make this feel practical.' },
          { id: 'q10-a03', text: 'Confidence', conversation: 'Confidence usually grows when you can see the steps clearly.' },
          { id: 'q10-a04', text: 'Lack of knowledge', conversation: 'That is exactly where training can help. You do not need to know everything before you begin.' },
          { id: 'q10-a05', text: 'Not knowing where to start', conversation: 'A clear starting point can change everything. Let us keep moving.' }
        ]
      },
      {
        id: 'question-11',
        text: 'Which statement sounds most like you?',
        conversation: 'This tells us what kind of roadmap would feel most useful to you.',
        answers: [
          { id: 'q11-a01', text: 'I need a clear plan', conversation: 'A clear plan can make a big goal feel much more manageable.' },
          { id: 'q11-a02', text: 'I need more confidence', conversation: 'That is very common. Confidence often follows practice and structure.' },
          { id: 'q11-a03', text: 'I need flexibility', conversation: 'Flexibility matters, especially when you are balancing work, family, and learning.' },
          { id: 'q11-a04', text: 'I need opportunity', conversation: 'Opportunity starts with building a skill people actually need.' },
          { id: 'q11-a05', text: 'I need a fresh start', conversation: 'A fresh start can be powerful when it comes with a practical path.' }
        ]
      },
      {
        id: 'question-12',
        text: 'If you became a locksmith, what excites you most?',
        conversation: 'The best path is one that connects with what you actually care about.',
        answers: [
          { id: 'q12-a01', text: 'Helping people', conversation: 'That purpose can make the work feel meaningful.' },
          { id: 'q12-a02', text: 'Being my own boss', conversation: 'Independence can be a powerful goal when paired with the right skill.' },
          { id: 'q12-a03', text: 'Earning more', conversation: 'Increasing income is a common reason people explore skilled trades.' },
          { id: 'q12-a04', text: 'Flexible hours', conversation: 'Flexibility can change the way work fits into your life.' },
          { id: 'q12-a05', text: 'Learning a trade', conversation: 'A real-world trade can give you confidence and practical value.' }
        ]
      },
      {
        id: 'question-13',
        text: 'Who would benefit most if your income improved?',
        conversation: 'Personal reasons often create the strongest motivation to keep going.',
        answers: [
          { id: 'q13-a01', text: 'Me', conversation: 'That matters. Improving your own situation is a strong reason to start.' },
          { id: 'q13-a02', text: 'My spouse', conversation: 'That is a meaningful reason. A better path can support the people closest to you.' },
          { id: 'q13-a03', text: 'My children', conversation: 'That is a powerful motivator. Building opportunity can impact your whole family.' },
          { id: 'q13-a04', text: 'My family', conversation: 'Family is a strong reason to keep moving forward.' },
          { id: 'q13-a05', text: 'Everyone', conversation: 'That is a big reason. When your situation improves, it can help everyone around you.' }
        ]
      },
      {
        id: 'question-14',
        text: 'How ready are you to make a positive change this year?',
        conversation: 'Readiness helps us understand whether you are exploring or prepared to take action.',
        answers: [
          { id: 'q14-a01', text: '1 - Just exploring', conversation: 'That is okay. Exploring is the first step.' },
          { id: 'q14-a02', text: '2', conversation: 'Good to know. Let us keep making the path clearer.' },
          { id: 'q14-a03', text: '3', conversation: 'You may still be weighing your options, and that is completely normal.' },
          { id: 'q14-a04', text: '4', conversation: 'You are starting to think seriously about what could change.' },
          { id: 'q14-a05', text: '5', conversation: 'You are in the middle. A clear roadmap may help you decide.' },
          { id: 'q14-a06', text: '6', conversation: 'That shows some real interest. Let us finish your profile.' },
          { id: 'q14-a07', text: '7', conversation: 'Nice. You may be closer to action than you think.' },
          { id: 'q14-a08', text: '8', conversation: 'Strong. That shows you are ready to seriously consider your next step.' },
          { id: 'q14-a09', text: '9', conversation: 'Excellent. You sound highly motivated.' },
          { id: 'q14-a10', text: '10 - Ready to take action', conversation: 'Great. That level of commitment can make a big difference.' }
        ]
      },
      {
        id: 'question-15',
        text: 'If we showed you a clear step-by-step roadmap, what would you want to achieve first?',
        conversation: 'Let us finish by choosing the first milestone that matters most.',
        answers: [
          { id: 'q15-a01', text: 'Get certified', conversation: 'Great. Certification can be an important milestone on your path.' },
          { id: 'q15-a02', text: 'Start earning income', conversation: 'That makes sense. A practical skill should connect to practical opportunity.' },
          { id: 'q15-a03', text: 'Work for a locksmith company', conversation: 'That can be a smart way to gain experience and confidence.' },
          { id: 'q15-a04', text: 'Start my own business', conversation: 'That is a strong goal. A roadmap can help turn that idea into steps.' },
          { id: 'q15-a05', text: 'Build a long-term career', conversation: 'Excellent. A long-term career starts with the first practical step.' }
        ]
      }
    ]
  };
}());
