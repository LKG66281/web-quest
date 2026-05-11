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

    // Compile Java
    exec("javac Main.java", (compileError, compileStdout, compileStderr) => {

        // Check if class file exists
        const classExists = fs.existsSync("Main.class");

        if (!classExists) {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            return res.end(`
                <h1>Compilation Failed ❌</h1>

                <h2>Error:</h2>
                <pre>${compileError ? compileError.message : "Unknown Error"}</pre>

                <h2>STDERR:</h2>
                <pre>${compileStderr}</pre>
            `);
        }

        // Run Java program
        exec("java Main", (runError, runStdout, runStderr) => {

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            if (runError) {
                return res.end(`
                    <h1>Runtime Error ❌</h1>

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
