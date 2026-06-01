export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  role: string;
  description: string;
  image: string;
  isTall: boolean;
  client: string;
  serviceProvided: string;
  liveLink?: string;
  techStack: string[];
  goal: {
    text: string;
    image: string;
  };
  challenge: {
    text: string;
    image: string;
  };
  result: {
    text: string;
    image: string;
  };
}

export const projects: Project[] = [
  {
    slug: "frameforge-gaming",
    title: "frameforge Gaming",
    category: "Web • Gaming",
    year: "2024",
    role: "Frontend Developer",
    description: "An immersive gaming e-commerce platform that combines a high-end product showcase with a robust authentication system. Designed to sell premium gaming gear while providing a seamless, direct-line service experience for customers to resolve issues quickly.",
    image: "/eceb_preview.png",
    isTall: false,
    client: "gaming",
    serviceProvided: "Web Development, UI Design",
    liveLink: "https://eceb-frontend.vercel.app/",
    techStack: ["Next.js", "React", "Tailwind CSS", "Firebase", "Framer Motion"],
    goal: {
      text: "To build a secure and lightning-fast marketplace that focuses on both conversion and customer trust through integrated authentication and an easy-access service model for hardware support.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2400"
    },
    challenge: {
      text: "Balancing the high-energy gaming aesthetic with a high-fidelity user journey, including a secure login system and a responsive customer support interface that manages product issues effortlessly.",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2400"
    },
    result: {
      text: "A professional, production-ready gaming store that successfully integrates an authentication layer and a service-first approach, leading to a significant boost in user retention and brand loyalty.",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2400"
    }
  },
  {
    slug: "yaop-community",
    title: "YAOP Community",
    category: "Non-Profit • Community",
    year: "2024",
    role: "Full Stack Designer",
    description: "A community-driven platform for the Youth Association of Purbichauki (YAOP). Focused on social impact, youth empowerment, and scholarship support, featuring a secure membership portal for local volunteers.",
    image: "/yaop_preview.png",
    isTall: true,
    client: "YAOP Association",
    serviceProvided: "Community Platform, UI/UX Design",
    liveLink: "https://yaop.vercel.app/",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    goal: {
      text: "To create a centralized digital hub that facilitates scholarship applications, volunteer coordination, and community news for the youth of Purbichauki.",
      image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2400"
    },
    challenge: {
      text: "Developing a robust scholarship management system that remains easy for first-time internet users to navigate while maintaining a modern, high-fidelity aesthetic.",
      image: "https://images.unsplash.com/photo-1521791136064-7986c29596ba?q=80&w=2400"
    },
    result: {
      text: "Successfully registered 200+ active volunteers and automated the scholarship application process, significantly increasing social reach and community engagement.",
      image: "https://images.unsplash.com/photo-1517048676732-2313653f8a02?q=80&w=2400"
    }
  },
];
