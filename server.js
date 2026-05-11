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
        System.out.println("Current dir: " + System.getProperty("user.dir"));
    }
}
`;

const server = http.createServer((req, res) => {
    const javaFile = path.join(EXEC_DIR, "Main.java");
    fs.writeFileSync(javaFile, javaCode);

    // Better debugging: list files + full paths
    exec("ls -la", { cwd: EXEC_DIR }, (lsErr, lsOut) => {
        console.log("Files in EXEC_DIR:", lsOut || lsErr?.message);
    });

    // 1. Compile
    exec("javac Main.java", {
        cwd: EXEC_DIR,
        timeout: 10000
    }, (compileError, compileStdout, compileStderr) => {
        if (compileError) {
            console.error("Compile error:", compileStderr || compileError.message);
            return res.end(`
                <h1>Compilation Error ❌</h1>
                <pre>${compileStderr || compileError.message}</pre>
            `);
        }

        console.log("Compilation successful");

        // 2. Run with EXPLICIT classpath + full java path for safety
        const runCmd = `java -cp . Main`;   // Critical change

        exec(runCmd, {
            cwd: EXEC_DIR,
            timeout: 10000,
            env: { ...process.env, PATH: process.env.PATH } // ensure PATH
        }, (runError, runStdout, runStderr) => {
            if (runError) {
                console.error("Runtime error:", runError.message);
                console.error("STDERR:", runStderr);
                return res.end(`
                    <h1>Runtime Error ❌</h1>
                    <h3>Command:</h3><pre>${runCmd}</pre>
                    <h3>Error:</h3><pre>${runError.message}</pre>
                    <h3>STDERR:</h3><pre>${runStderr || 'None'}</pre>
                    <h3>Working dir:</h3><pre>${EXEC_DIR}</pre>
                `);
            }

            res.end(`
                <h1>Java Execution Success ✅</h1>
                <h2>Output:</h2>
                <pre>${runStdout}</pre>
            `);
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
