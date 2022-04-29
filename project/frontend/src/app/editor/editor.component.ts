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

  @ViewChild("codeEditor") private editor: ElementRef<HTMLElement>;
  private aceEditor: ace.Ace.Editor;
  private editorBeautify;

  THEME: string = 'ambiance';
  LANG: string = 'c_cpp';

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
    this.aceEditor.session.setMode('ace/mode/' + this.LANG);

    this.aceEditor.session.setValue(
      `#include<bits/stdc++.h>
    using namespace std;
  int main() {
  cout << "Hello World" << endl;
  return 0;
}`
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
    this.aceEditor.session.setMode('ace/mode/' + this.LANG);
    switch (this.LANG) {
      case 'c_cpp': {
        this.aceEditor.session.setValue(
          `#include<bits/stdc++.h>
  using namespace std;
  int main() {
    cout << "Hello World" << endl;
    return 0;
  }`
        );
        break;
      }
      case 'python': {
        this.aceEditor.session.setValue(
          `print("Hello World")`
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
