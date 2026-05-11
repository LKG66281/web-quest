const http = require("http");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const PORT = process.env.PORT || 5000;

const EXEC_DIR = "/tmp/java";

if (!fs.existsSync(EXEC_DIR)) {
    fs.mkdirSync(EXEC_DIR, { recursive: true });
}

const javaCode = `
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Render!");
    }
}
`;

const server = http.createServer((req, res) => {

    const javaFile = path.join(EXEC_DIR, "Main.java");

    fs.writeFileSync(javaFile, javaCode);

    // Compile Java
    exec(
        "javac Main.java",
        {
            cwd: EXEC_DIR,
            timeout: 5000
        },
        (compileError, compileStdout, compileStderr) => {

            if (compileError) {
                return res.end(`
                    <h1>Compilation Error ❌</h1>
                    <pre>${compileStderr || compileError.message}</pre>
                `);
            }

            // Run Java
            exec(
                "java Main",
                {
                    cwd: EXEC_DIR,
                    timeout: 5000
                },
                (runError, runStdout, runStderr) => {

                    if (runError) {
                        return res.end(`
                            <h1>Runtime Error ❌</h1>

                            <h2>Error:</h2>
                            <pre>${runError.message}</pre>

                            <h2>STDERR:</h2>
                            <pre>${runStderr}</pre>
                        `);
                    }

                    res.end(`
                        <h1>Java Compilation Success ✅</h1>

                        <h2>Output:</h2>

                        <pre>${runStdout}</pre>
                    `);
                }
            );
        }
    );
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
