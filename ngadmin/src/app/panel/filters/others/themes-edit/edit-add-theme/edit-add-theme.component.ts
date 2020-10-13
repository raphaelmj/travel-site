import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Theme } from 'src/app/models/theme';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ThemeService } from 'src/app/services/filters/theme.service';
import { RefreshThemesService } from 'src/app/services/refresh-themes.service';

@Component({
  selector: 'app-edit-add-theme',
  templateUrl: './edit-add-theme.component.html',
  styleUrls: ['./edit-add-theme.component.less']
})
export class EditAddThemeComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Input() theme: Theme
  @Input() isNew: boolean = true
  editForm: FormGroup

  constructor(private fb: FormBuilder, private themeService: ThemeService, private refreshThemesService: RefreshThemesService) { }

  ngOnInit() {
    this.editForm = this.createForm()
  }


  createForm(): FormGroup {
    return this.fb.group({
      name: [this.theme.name, Validators.required],
    })
  }

  closeEdit() {
    this.emitClose.emit()
  }


  saveData() {
    var theme: Theme = { ...this.theme, ...this.editForm.value }
    if (this.isNew) {
      this.themeService.createNew(theme).then(r => {
        console.log(r)
        this.refreshThemesService.makeRefresh()
        this.emitClose.emit()
      })
    } else {
      this.themeService.updateOne(theme).then(r => {
        console.log(r)
        this.refreshThemesService.makeRefresh()
      })
    }
  }


}
