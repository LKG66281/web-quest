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

    exec(
        "which java && which javac && java -version && javac -version",
        (checkError, checkStdout, checkStderr) => {

            exec(
                "javac Main.java",
                { timeout: 5000 },
                (compileError, compileStdout, compileStderr) => {

                    exec(
                        "ls",
                        (lsError, lsStdout) => {

                            res.writeHead(200, {
                                "Content-Type": "text/html"
                            });

                            res.end(`
                                <h1>Java Debug</h1>

                                <h2>Java Paths:</h2>
                                <pre>${checkStdout}</pre>

                                <h2>Java STDERR:</h2>
                                <pre>${checkStderr}</pre>

                                <h2>Files:</h2>
                                <pre>${lsStdout}</pre>

                                <h2>Compile Error:</h2>
                                <pre>${compileError ? compileError.message : "No Error"}</pre>

                                <h2>Compile STDERR:</h2>
                                <pre>${compileStderr}</pre>
                            `);
                        }
                    );
                }
            );
        }
    );
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
