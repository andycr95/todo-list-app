import { Pipe, PipeTransform } from '@angular/core';
import * as emoji from 'node-emoji';

@Pipe({name: 'emojify', standalone: true})
export class EmojiPipe implements PipeTransform {
  transform(value: string): string {
    return emoji.emojify(value);
  }
}