const MaxSize = 256; // 1 << 8
const MaxFiles = 65536; // 1 << 16
const FileHeaderSize = 6;
const ImageHeaderSize = 16;
const IcoMime = "image/x-icon";
class PngIcoConverter {
    async convertToBlobAsync(inputs, mime = IcoMime) {
        const arr = await this.convertAsync(inputs);
        return new Blob([arr], {
            type: mime,
        });
    }
    async convertAsync(inputs) {
        const inLen = inputs.length;
        if (inLen > MaxFiles) {
            throw new Error("TOO_MANY_FILES");
        }
        // File Format: https://en.wikipedia.org/wiki/ICO_(file_format)
        // File Header + Image Header + Image Content
        const headersLen = FileHeaderSize + ImageHeaderSize * inLen;
        const totalLen = headersLen + this.sumInputLen(inputs);
        const arr = new Uint8Array(totalLen);
        // File Header
        arr.set([0, 0, 1, 0, ...this.to2Bytes(inLen)], 0);
        // Image Headers & Data
        let imgPos = headersLen;
        for (let i = 0; i < inputs.length; i++) {
            const currPos = FileHeaderSize + ImageHeaderSize * i, input = inputs[i];
            const blob = this.toBlob(input.png), img = await this.loadImageAsync(blob), w = img.naturalWidth, h = img.naturalHeight;
            if (!input.ignoreSize &&
                (w > MaxSize || h > MaxSize)) {
                throw new Error("INVALID_SIZE");
            }
            // Header
            arr.set([
                w > MaxSize ? 0 : w,
                h > MaxSize ? 0 : h,
                0,
                0,
                0, 0,
                ...(input.bpp ? this.to2Bytes(input.bpp) : [0, 0]),
                ...this.to4Bytes(blob.size),
                ...this.to4Bytes(imgPos),
            ], currPos);
            // Image
            const buffer = input.png instanceof ArrayBuffer ? input.png : await input.png.arrayBuffer();
            arr.set(new Uint8Array(buffer), imgPos);
            imgPos += blob.size;
        }
        return arr;
    }
    loadImageAsync(png) {
        return new Promise((r, rej) => {
            const img = new Image();
            img.onload = () => r(img);
            img.onerror = () => rej("INVALID_IMAGE");
            img.src = URL.createObjectURL(png);
        });
    }
    toBlob(input, type = "image/png") {
        return input instanceof Blob ? input : new Blob([input], {
            type,
        });
    }
    to2Bytes(n) {
        return [n & 255, (n >> 8) & 255];
    }
    to4Bytes(n) {
        return [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255];
    }
    sumInputLen(inputs) {
        let total = 0;
        for (const i of inputs) {
            const png = i.png;
            if (png instanceof Blob) {
                total += png.size;
            }
            else {
                total += png.byteLength;
            }
        }
        return total;
    }
}
//# sourceMappingURL=png2icojs.js.map
window.PngIcoConverter = PngIcoConverter;
