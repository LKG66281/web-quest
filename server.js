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
        "javac Main.java && java Main",
        { timeout: 5000 },
        (error, stdout, stderr) => {

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            if (error) {
                return res.end(`
                    <h1>Compilation/Execution Error ❌</h1>
                    <pre>${error.message}</pre>
                `);
            }

            if (stderr) {
                return res.end(`
                    <h1>Java Error ❌</h1>
                    <pre>${stderr}</pre>
                `);
            }

            res.end(`
                <h1>Java Compilation Success ✅</h1>
                <h2>Output:</h2>
                <pre>${stdout}</pre>
            `);
        }
    );
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
