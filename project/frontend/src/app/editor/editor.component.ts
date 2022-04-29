import { Component, ElementRef, AfterViewInit, ViewChild, Input } from '@angular/core';

import * as ace from "ace-builds";
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-ambiance';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-chaos';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';

import { templates } from '../attempt-exam/templates';


@Component({
  selector: 'app-editor',
  // template: `<div
  // class="app-ace-editor"
  // #editor
  // style="width: 500px;height: 250px;"
  // ></div>`,
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
  // styles: [
  //   `
  //     .app-ace-editor {
  //       border: 2px solid #f8f9fa;
  //       box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  //     }
  //   `,],
})
export class EditorComponent implements AfterViewInit {
  @Input() input_code: string;
  @ViewChild("codeEditor") private editor: ElementRef<HTMLElement>;
  private aceEditor: ace.Ace.Editor;
  private editorBeautify;

  THEME: string = 'ambiance';
  LANG: string = 'c_cpp';

  actual_lang: string = 'c_cpp';

  code: string = '';

  ngAfterViewInit(): void {
    ace.config.set("fontSize", "16px");
    ace.config.set('basePath', 'path');
    ace.require('ace/ext/language_tools');
    this.editorBeautify = ace.require('ace/ext/beautify');
    // const aceEditor = ace.edit(this.editor.nativeElement);
    // aceEditor.session.setValue("<h1>Ace Editor works great in Angular!</h1>");

    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 14,
      maxLines: Infinity,
    };
    const extraEditorOptions = {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    };
    const editorOptions = Object.assign(basicEditorOptions, extraEditorOptions);
    this.aceEditor = ace.edit(this.editor.nativeElement, editorOptions);

    this.aceEditor.setTheme('ace/theme/' + this.THEME);
    this.aceEditor.session.setMode('ace/mode/' + this.actual_lang);

    console.log(this.input_code);
    this.aceEditor.session.setValue(
      this.input_code
    );
  }

  public beautifyContents() {
    if (this.aceEditor && this.editorBeautify) {
      const session = this.aceEditor.getSession();
      this.editorBeautify.beautify(session);
    }
  }

  public updateTheme() {
    this.aceEditor.setTheme('ace/theme/' + this.THEME);
  }

  public updateLang() {

    if (this.LANG == 'media/templates/2.cpp' || this.LANG == 'media/templates/3.cpp') {
      this.actual_lang = 'c_cpp';
    }
    else {
      this.actual_lang = 'python';
    }

    this.aceEditor.session.setMode('ace/mode/' + this.actual_lang);
    switch (this.LANG) {
      case 'media/templates/2.cpp': {
        this.aceEditor.session.setValue(
          templates[this.LANG]
        );
        break;
      }
      case 'media/templates/3.cpp': {
        this.aceEditor.session.setValue(
          templates[this.LANG]
        );
        break;
      }
      case 'media/templates/0.py': {
        this.aceEditor.session.setValue(
          templates[this.LANG]
        );
        break;
      }
      case 'media/templates/1.py': {
        this.aceEditor.session.setValue(
          templates[this.LANG]
        );
      }
    }
  }

  public runCode() {
    this.code = this.aceEditor.session.getValue();
    // const send : RunInput = {
    //   username : this.uservice.getUser(),
    //   script : this.code,
    //   language : this.LANG,
    //   input : this.input
    // };
    console.log(this.code);
  }

}
