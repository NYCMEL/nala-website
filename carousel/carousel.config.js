window.app = window.app || {};

window.app.carousel = {
  id: "mtk-carousel",
  startIndex: 0,
  autoPlay: false,
  interval: 4000,
  slides: [
    {
      id: "slide-1",
      html: `
        <div class="p-4 text-center">
          <h3>Lorem Ipsum One</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      `
    },
    {
      id: "slide-2",
      html: `
        <div class="p-4 text-center bg-light">
          <h3>Lorem Ipsum Two</h3>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      `
    },
    {
      id: "slide-3",
      html: `
        <div class="p-4 text-center">
          <h3>Lorem Ipsum Three</h3>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
        </div>
      `
    }
  ]
};
