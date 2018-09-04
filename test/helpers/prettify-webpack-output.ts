export default function prettifyWebpackOutput(output: string): string {
    return output.replace(/\\n/g, '\n').replace(/\\"/g, `'`);
}
