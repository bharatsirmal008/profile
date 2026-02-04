const projects = [
    {
        title: "My personal artwork",
        image: "/project1.jpg",
    },
    {
        title: "Neon sign for Fatty's Bar",
        image: "/project2.jpg",
    },
    {
        title: "Sign for San Diego Apparel",
        image: "/project3.jpg",
    },
    {
        title: "Neon sign for Jeff’s",
        image: "/project4.jpg",
    },
]

export default function Projects() {
    return (
        <section
            id="projects"
            className="min-h-screen bg-black text-white flex items-center"
        >
            <div className="max-w-7xl mx-auto px-6 w-full">

                {/* Title */}
                <h2 className="text-5xl md:text-6xl font-serif mb-20">
                    More of My Work
                </h2>

                {/* Projects Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

                    {projects.map((project, index) => (
                        <div key={index} className="space-y-4">

                            {/* Image */}
                            <div className="w-full h-72 rounded-full overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Caption */}
                            <div className="flex items-start gap-2 text-sm text-gray-300">
                                <span>↘</span>
                                <p>{project.title}</p>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </section>
    )
}
