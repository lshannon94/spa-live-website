const revealElements = document.querySelectorAll(
    ".section-heading, .project-image, .about, .contact .work-background"
);

console.log("Reveal elements:", revealElements);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.20
    }
);


revealElements.forEach((element) => {

    observer.observe(element);

});


/* ------------------------------
   PROJECT PARALLAX
------------------------------ */

const projects = document.querySelectorAll(".project");


projects.forEach((project) => {

    const image = project.querySelector(".project-image");


    project.addEventListener("mousemove", (event) => {

        if (!image.classList.contains("visible")) {
            return;
        }

        const rect = project.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const moveX = (x / rect.width - 0.5) * 12;
        const moveY = (y / rect.height - 0.5) * 12;

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

/* ------------------------------
   WORK IMAGE SCROLL ANIMATION
------------------------------ */

const workHeading = document.querySelector(".work-heading");
const workBackground = document.querySelector(".work-background");


function updateWorkImage() {

    if (!workHeading || !workBackground) {
        return;
    }


    const rect = workHeading.getBoundingClientRect();

    const viewportHeight = window.innerHeight;


    /*
       Progress through the heading.

       0 = heading is entering
       1 = heading has almost passed
    */

    let progress =
        (viewportHeight - rect.top) /
        (viewportHeight * 0.95);


    progress = Math.max(0, Math.min(1, progress));


    /*
       Smooth the movement.

       This makes the image accelerate
       gently rather than moving linearly.
    */

    const eased =
        progress * progress * (3 - 2 * progress);


    /*
       IMAGE POSITION

       Starts far left
       Ends on the right
    */

    const startX = -window.innerWidth * 0.75;

    const endX = window.innerWidth * 0.35;


    const x =
        startX +
        (endX - startX) * eased;


    /*
       Slight scale change
    */

    const scale =
        0.85 +
        (0.15 * eased);


    /*
       Fade in
    */

    let opacity;

    if (progress < 0.15) {

        opacity =
            (progress / 0.15) * 0.45;

    } else {

        opacity = 0.45;

    }


    /*
       Apply movement
    */

   const rotation = -90 + (180 * eased);

workBackground.style.transform =
    `translate3d(${x}px, -50%, 0) 
     scale(${scale}) 
     rotate(${rotation}deg)`;

    workBackground.style.opacity = opacity;

}


window.addEventListener(
    "scroll",
    updateWorkImage,
    { passive: true }
);


window.addEventListener(
    "resize",
    updateWorkImage
);


updateWorkImage();

/* ------------------------------
   CONTACT REVEAL
------------------------------ */

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
            threshold: 0.1
        }
    );

    contactObserver.observe(contactSection);
}

/* ------------------------------
   RANDOM PROJECT SCROLL MOTION
------------------------------ */

const projectImages = document.querySelectorAll(".project-image");

const projectMotion = [];


/* Generate a different movement
   pattern for every image */

projectImages.forEach((image) => {

    projectMotion.push({

        x: (Math.random() - 0.1) * 6,

        y: (Math.random() - 0.1) * 8,

        rotate: (Math.random() - 0.1) * 1,

        scale: 1 + (Math.random() - 0.3) * 0.04

    });

});


function updateProjectMotion() {

    projectImages.forEach((image, index) => {

        const rect = image.getBoundingClientRect();

        const viewportHeight = window.innerHeight;


        /*
           Calculate where the image is
           relative to the viewport.
        */

        const progress =
            (viewportHeight - rect.top) /
            (viewportHeight + rect.height);


        /*
           Keep movement between 0 and 1.
        */

        const p =
            Math.max(0, Math.min(1, progress));


        /*
           Smooth easing.
        */

        const eased =
            p * p * (3 - 2 * p);


        const motion = projectMotion[index];


        /*
           Create the travelling movement.
        */

        const x =
            motion.x * eased;

        const y =
            motion.y * eased;

        const rotation =
            motion.rotate * eased;

        const scale =
            1 + (motion.scale - 1) * eased;


        /*
           Only apply movement if the
           image has already revealed.
        */

        if (image.classList.contains("visible")) {

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

        }

    });

}


window.addEventListener(
    "scroll",
    updateProjectMotion,
    { passive: true }
);


window.addEventListener(
    "resize",
    updateProjectMotion
);


updateProjectMotion();