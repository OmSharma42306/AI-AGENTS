import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4">
        {`I'm Om Sharma, a Full Stack Developer passionate about building robust, scalable, and efficient web applications. I specialize in the MERN stack—MongoDB, Express.js, React, and Node.js—while leveraging additional expertise in PostgreSQL, Prisma ORM, and Docker. With skills in Python, WebRTC, and socket programming, I thrive on creating seamless real-time communication experiences. My experience extends to cloud platforms like AWS and Kubernetes, as well as modern serverless architecture.

Proficient in TypeScript and JavaScript, I combine my knowledge of DSA, DBMS, OS, and Computer Networks to design and implement optimized solutions. Whether tackling complex backend systems or crafting intuitive frontends, I am driven by a commitment to clean, maintainable, and impactful code.`}
      </p>
    </section>
  )
}
