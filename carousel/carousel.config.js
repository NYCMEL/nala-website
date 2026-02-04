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
    <article class="carousel-card">
	<h2 align="center">
	    Career Switcher
	</h2>

	<p>
Someone leaving an office or retail job uses the program to learn residential and
commercial locksmithing fundamentals. By following the structured lessons and
practicing alongside the videos, they build confidence handling basic service calls
and entry-level jobs.
	</p>
    </article>
</div>
      `
	},
	{
	    id: "slide-2",
	    html: `
<div class="p-4">
    <article class="carousel-card">
	<h2 align="center">
	Handyman Expanding Services
        </h2>

    <p>
A general handyman uses the program to add locksmithing as a paid service.
Residential rekeying, deadbolt installation, and keypad locks become add-on
services that increase the value of each job.
    </p>
</article>
</div>
      `
	},
	{
	    id: "slide-3",
	    html: `
<div class="p-4">
<article class="carousel-card">
	<h2 align="center">
	    Automotive Focus
        </h2>

    <p>
A learner with an interest in cars focuses on the automotive sections of the program
to understand vehicle entry methods, key types, and modern locking systems, using
the training as a foundation for further hands-on experience.
    </p>
</article>
</div>
      `
	},
	{
	    id: "slide-4",
	    html: `
<div class="p-4">
<article class="carousel-card">
	<h2 align="center">
	    Business Builder
        </h2>

    <p>
Someone with technical skills but no business background follows the business
modules to understand pricing, licensing considerations, customer communication,
and marketing fundamentals before launching a locksmith service.
    </p>
</article>
</div>
      `
	},
	{
	    id: "slide-5",
	    html: `
<div class="p-4">
<article class="carousel-card">
	<h2 align="center">
	    Supplemental Trade Skill
        </h2>

    <p>
An electrician or security technician uses the program to better understand locks,
doors, and access control hardware, allowing them to coordinate more effectively
on job sites and offer broader solutions.
    </p>
</article>
</div>
      `
	}
    ]
};
