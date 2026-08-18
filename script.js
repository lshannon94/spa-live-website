/* =========================================================
   SPA LIVE — MAIN SCRIPT
   ========================================================= */


/* =========================================================
   SCROLL REVEALS
   ========================================================= */

const revealElements = document.querySelectorAll(
    ".section-heading, .project-image, .about"
);

const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.20
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});


/* =========================================================
   CONTACT REVEAL
   ========================================================= */

const contactSection = document.querySelector(".contact");

if (contactSection) {

    const contactObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    contactSection.classList.add("visible");

                    contactObserver.unobserve(contactSection);

                }

            });

        },
        {
            threshold: 0.10
        }
    );

    contactObserver.observe(contactSection);
}


/* =========================================================
   PROJECT MOUSE PARALLAX
   ========================================================= */

const projects = document.querySelectorAll(".project");

const hasFinePointer = window.matchMedia(
    "(pointer: fine)"
).matches;


if (hasFinePointer) {

    projects.forEach((project) => {

        const image = project.querySelector(".project-image");

        if (!image) {
            return;
        }

        project.addEventListener("mousemove", (event) => {

            if (!image.classList.contains("visible")) {
                return;
            }

            const rect = project.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const moveX =
                (x / rect.width - 0.5) * 12;

            const moveY =
                (y / rect.height - 0.5) * 12;

            image.style.setProperty(
                "--move-x",
                `${moveX}px`
            );

            image.style.setProperty(
                "--move-y",
                `${moveY}px`
            );

        });


        project.addEventListener("mouseleave", () => {

            image.style.setProperty(
                "--move-x",
                "0px"
            );

            image.style.setProperty(
                "--move-y",
                "0px"
            );

        });

    });

}


/* =========================================================
   PROJECT RANDOM SCROLL MOTION
   ========================================================= */

const projectImages = document.querySelectorAll(
    ".project-image"
);

const projectMotion = [];


/*
   Give every project image its own
   subtle travelling movement.

   Values are now balanced around zero,
   meaning images can travel in either
   direction.
*/

projectImages.forEach((image) => {

    projectMotion.push({

        x:
            (Math.random() - 0.5) * 12,

        y:
            (Math.random() - 0.5) * 16,

        rotate:
            (Math.random() - 0.5) * 2,

        scale:
            1 + (Math.random() - 0.5) * 0.05

    });

});


/* =========================================================
   WORK HEADING MOVING IMAGE
   ========================================================= */

const workHeading =
    document.querySelector(".work-heading");

const workBackground =
    document.querySelector(".work-background");


/* =========================================================
   SCROLL STATE
   ========================================================= */

let scrollTicking = false;


/*
   Main scroll animation function.

   Everything that changes while scrolling is
   calculated here inside requestAnimationFrame.

   This prevents the browser from repeatedly
   running layout calculations directly inside
   the scroll event.
*/

function updateScrollAnimations() {

    scrollTicking = false;


    /* -----------------------------------------------------
       WORK HEADING IMAGE
       ----------------------------------------------------- */

    if (workHeading && workBackground) {

        const rect =
            workHeading.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight;


        /*
           Progress through the heading.

           0 = heading entering viewport
           1 = heading nearly passed
        */

        let progress =
            (viewportHeight - rect.top) /
            (viewportHeight * 0.95);


        progress =
            Math.max(
                0,
                Math.min(1, progress)
            );


        /*
           Smooth ease-in/ease-out.
        */

        const eased =
            progress *
            progress *
            (3 - 2 * progress);


        /*
           Horizontal movement.

           Starts well off-screen left.
           Finishes towards the right.
        */

        const startX =
            -window.innerWidth * 0.75;

        const endX =
            window.innerWidth * 0.35;


        const x =
            startX +
            (endX - startX) * eased;


        /*
           Scale.

           Slightly smaller at the beginning,
           returning to normal size.
        */

        const scale =
            0.85 +
            (0.15 * eased);


        /*
           Opacity.

           Fades in gently rather than appearing
           immediately.
        */

        let opacity;

        if (progress < 0.15) {

            opacity =
                (progress / 0.15) * 0.45;

        } else {

            opacity = 0.45;

        }


        /*
           Rotation.

           Starts at -90 degrees
           and rotates through to +90 degrees.
        */

        const rotation =
            -90 + (180 * eased);


        /*
           Apply the complete transform.
        */

        workBackground.style.transform =
            `translate3d(${x}px, -50%, 0)
             scale(${scale})
             rotate(${rotation}deg)`;

        workBackground.style.opacity =
            opacity;

    }


    /* -----------------------------------------------------
       PROJECT IMAGE TRAVEL
       ----------------------------------------------------- */

    projectImages.forEach((image, index) => {

        /*
           Don't calculate movement for images
           that haven't revealed yet.
        */

        if (!image.classList.contains("visible")) {
            return;
        }


        const rect =
            image.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight;


        /*
           Calculate the image's position
           through the viewport.

           0 = entering
           1 = leaving
        */

        const progress =
            (viewportHeight - rect.top) /
            (viewportHeight + rect.height);


        /*
           Clamp between 0 and 1.
        */

        const p =
            Math.max(
                0,
                Math.min(1, progress)
            );


        /*
           Smooth movement.
        */

        const eased =
            p *
            p *
            (3 - 2 * p);


        const motion =
            projectMotion[index];


        /*
           Calculate movement.
        */

        const x =
            motion.x * eased;

        const y =
            motion.y * eased;

        const rotation =
            motion.rotate * eased;

        const scale =
            1 +
            (motion.scale - 1) * eased;


        /*
           Send the values to CSS.

           Your existing CSS already uses these
           variables, so no CSS changes are needed.
        */

        image.style.setProperty(
            "--scroll-x",
            `${x}px`
        );

        image.style.setProperty(
            "--scroll-y",
            `${y}px`
        );

        image.style.setProperty(
            "--scroll-rotate",
            `${rotation}deg`
        );

        image.style.setProperty(
            "--scroll-scale",
            scale
        );

    });

}


/* =========================================================
   SCROLL EVENT
   ========================================================= */

window.addEventListener(
    "scroll",
    () => {

        /*
           Only request one animation frame at a time.
        */

        if (!scrollTicking) {

            window.requestAnimationFrame(
                updateScrollAnimations
            );

            scrollTicking = true;

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        /*
           Recalculate immediately after resizing.
        */

        updateScrollAnimations();

    }
);


/* =========================================================
   INITIAL UPDATE
   ========================================================= */

updateScrollAnimations();
