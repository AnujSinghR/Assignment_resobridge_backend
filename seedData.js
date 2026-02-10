const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedPosts = [
    {
        title: "The Future of Web Development: What to Expect in 2024",
        slug: "future-of-web-development-2024",
        content: `Web development is an ever-evolving field. As we move further into 2024, several trends are shaping the way we build and interact with the web.

### 1. The Rise of AI-Assisted Coding
Tools like GitHub Copilot and ChatGPT are becoming integral to the developer workflow. They aren't replacing developers but are acting as powerful force multipliers, handling boilerplate code and suggesting optimizations.

### 2. Server-Side Rendering (SSR) is King
With frameworks like Next.js leading the charge, SSR and Static Site Generation (SSG) have become the standard for performance-critical applications. The benefits for SEO and initial load times are undeniable.

### 3. Rust is Everywhere
Rust is finding its way into the web ecosystem, powering tools like Turbopack and formatting tools. Its speed and memory safety make it an ideal choice for the underlying infrastructure of the web.

Techniques to watch:
- **Project IDX** by Google
- **WebAssembly** adoption
- **Edge Computing**`,
        tags: ["webdev", "trends", "2024", "tech"],
        status: "published"
    },
    {
        title: "Mastering React Hooks: A Comprehensive Guide",
        slug: "mastering-react-hooks-guide",
        content: `React Hooks revolutionized how we write components. Gone are the days of complex class components; functional components are now the first-class citizens.

## useState
The most fundamental hook. It allows you to add state to function components.
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect
This hook handles side effects. It replaces \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\`.

## Custom Hooks
The real power lies in creating your own hooks to encapsulate logic. For example, a \`useFetch\` hook can standardize how you make API calls across your application.`,
        tags: ["react", "javascript", "coding", "tutorial"],
        status: "published"
    },
    {
        title: "Why Developer Experience (DX) Matters",
        slug: "why-developer-experience-matters",
        content: `In the rush to build features for users, we often neglect the experience of the people building those features.

Good DX leads to:
1.  **Faster Delivery**: When tools work well, developers move faster.
2.  **Higher Quality**: Better debugging and testing tools catch bugs early.
3.  **Happier Teams**: No one likes fighting with configuration files for hours.

Investing in your internal tooling and documentation is just as important as your customer-facing UI.`,
        tags: ["dx", "productivity", "management"],
        status: "published"
    },
    {
        title: "Understanding TypeScript Generics",
        slug: "understanding-typescript-generics",
        content: `Generics are one of the most powerful features in TypeScript, effectively allowing you to create reusable components.

Instead of working with a single data type, components can work over a variety of data types rather than a single one. This allows users to consume these components and use their own types.

### Basic Syntax
\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}
\`\`\`
This ensures that if you pass a number, the function returns a number. If you pass a string, it returns a string.`,
        tags: ["typescript", "programming", "webdev"],
        status: "draft"
    },
    {
        title: "The Art of Minimalist Design",
        slug: "art-of-minimalist-design",
        content: `Minimalism isn't just about using less; it's about using exactly enough. 

In UI design, every element should have a purpose. If it doesn't help the user achieve their goal, it's clutter.
*   **Whitespace** is your friend.
*   **Typography** establishes hierarchy.
*   **Color** directs attention.

"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."`,
        tags: ["design", "ui/ux", "minimalism"],
        status: "published"
    }
];

const importData = async () => {
    try {
        // Find the admin user to assign posts to
        const adminUser = await User.findOne({ email: 'admin@example.com' });

        if (!adminUser) {
            console.error('Error: Admin user (admin@example.com) not found. Please run createAdmin.js first.');
            process.exit(1);
        }

        await Post.deleteMany(); // Clear existing posts? Optional. Let's clear for a clean slate.

        const samplePosts = seedPosts.map(post => {
            return { ...post, author: adminUser._id };
        });

        await Post.insertMany(samplePosts);

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();
