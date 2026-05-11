const http = require("http");
const fs = require("fs");
const { exec } = require("child_process");

const PORT = process.env.PORT || 5000;

const javaCode = `
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Render!");
    }
}
`;

const server = http.createServer((req, res) => {

    fs.writeFileSync("Main.java", javaCode);

    // STEP 1: Compile
    exec("javac Main.java", { timeout: 5000 }, (compileError, compileStdout, compileStderr) => {

        if (compileError) {
            res.writeHead(200, { "Content-Type": "text/html" });

            return res.end(`
                <h1>Compilation Error ❌</h1>

                <h2>Error:</h2>
                <pre>${compileError.message}</pre>

                <h2>STDERR:</h2>
                <pre>${compileStderr}</pre>
            `);
        }

        // STEP 2: Run
        exec("java Main", { timeout: 5000 }, (runError, runStdout, runStderr) => {

            res.writeHead(200, { "Content-Type": "text/html" });

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
        });
    });
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
