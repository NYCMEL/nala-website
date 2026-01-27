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
<div class="p-4">
    <article class="story-card">
	<h2 align="center">From Side Job to a Real Future</h2>

	<p>
	    I’m 45 years old, married, with two children. Like many people at this stage
	    of life, I wasn’t looking to start over, but I was looking for something more.
	    I wanted a way to earn additional income without sacrificing time with my family.
	</p>

	<p>
	    When I discovered the locksmith program, I was skeptical at first. But as I
	    progressed through the course, I quickly realized how well structured and
	    practical it was. There was no guesswork, just clear instruction and real-world
	    guidance.
	</p>

	<div class="quote">
	    What began as a side job slowly turned into a reliable income stream and a
	    realistic path toward a retirement career of my own.
	</div>

	<p>
	    The expert advice and ongoing support made a huge difference. I wasn’t just
	    learning theory, I was gaining confidence with every step. Even after finishing
	    the course, the guidance didn’t stop.
	</p>

	<p>
	    Today, I feel secure knowing I have skills I can rely on. This program didn’t
	    just teach me a trade. It gave me direction, independence, and the belief that
	    building a better future is absolutely possible.
	</p>
    </article>
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
