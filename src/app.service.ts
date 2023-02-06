import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as child_process from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

const TMP_DIR: string = path.resolve('./tmp');

@Injectable()
export class AppService {
  async renderSvgFromUrl(url: string): Promise<Buffer> {
    return axios.get(url).then(response => this.renderSvg(response.data));
  }

  async renderPngFromUrl(url: string): Promise<Buffer> {
    return axios.get(url).then(response => this.renderPng(response.data));
  }

  async renderSvg(document: string): Promise<Buffer> {
    const { source, target } = this.determineSourceAndTarget('svg');
    const cmd = this.determineCmd('svg', source, target);
    return this.render(document, source, target, cmd);
  }

  async renderPng(document: string): Promise<Buffer> {
    const { source, target } = this.determineSourceAndTarget('png');
    const cmd = this.determineCmd('png', source, target);
    return this.render(document, source, target, cmd);
  }

  async render(document: string, source: string, target: string, cmd: string): Promise<Buffer> {
    let result: Buffer = null;

    const consumer = async (): Promise<void> => {
      return fs.readFile(target).then(buffer => {
        result = buffer
        return Promise.resolve();
      });
    };

    const producer = async (): Promise<Buffer> => Promise.resolve(result);

    return this.prepare(source, document)
    .then(this.exec(cmd))
    .then(consumer)
    .then(this.cleanup(source, target))
    .then(producer);
  }

  async prepare(source: string, document: string): Promise<void> {
    return this.maybeCreateTmpDir().then(() => fs.writeFile(source, document));
  }

  cleanup(source: string, target: string): () => Promise<void> {
    return async () => fs.rm(source).then(() => fs.rm(target));
  }

  async maybeCreateTmpDir(): Promise<void> {
    return fs.stat(TMP_DIR).then(stats => Promise.resolve()).catch(err => fs.mkdir(TMP_DIR));
  };

  exec(cmd: string): () => Promise<void> {
    return () => {
      try {
        child_process.execSync(cmd);
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    };
  }

  determineSourceAndTarget(format: 'svg' | 'png'): { source: string, target: string } {
    const basename: string = uuid.v4();
    const source: string = path.join(TMP_DIR, `${basename}.puml`);
    const target: string = path.join(TMP_DIR, `${basename}.${format}`);
    return {
      source,
      target
    };
  }

  determineCmd(format: 'svg' | 'png', source: string, target: string): string {
    return `java -jar ./plantuml.jar -headless -p -t${format} < "${source}" > "${target}"`;
  }
}
