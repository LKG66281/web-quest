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
        "pwd && ls && javac Main.java && java Main",
        { timeout: 5000 },
        (error, stdout, stderr) => {

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(`
                <h1>Debug Output</h1>

                <h2>STDOUT:</h2>
                <pre>${stdout}</pre>

                <h2>STDERR:</h2>
                <pre>${stderr}</pre>

                <h2>ERROR:</h2>
                <pre>${error ? error.message : "No Error"}</pre>
            `);
        }
    );
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
