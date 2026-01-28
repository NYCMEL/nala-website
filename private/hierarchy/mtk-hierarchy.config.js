window.app = window.app || {};

window.app.hierarchy = {
  events: {
    init: "mtk-hierarchy:init",
    select: "mtk-hierarchy:select",
    contentLoaded: "mtk-hierarchy:content-loaded",
    error: "mtk-hierarchy:error"
  },
  items: [
    {
      label: "Introduction",
      icon: "info",
      content: {
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        images: [
          "https://via.placeholder.com/800x400",
          "https://via.placeholder.com/800x300"
        ]
      }
    },
    {
      label: "Architecture",
      icon: "account_tree",
      content: {
        images: [
          "https://via.placeholder.com/800x500",
          "https://via.placeholder.com/800x350"
        ]
      }
    },
    {
      label: "Implementation",
      icon: "code",
      content: {
        video: "https://www.w3schools.com/html/movie.mp4"
      }
    }
  ]
};
