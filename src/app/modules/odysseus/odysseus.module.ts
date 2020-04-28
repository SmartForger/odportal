import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContainerComponent } from './container/container.component';
import { MaterialModule } from '../../material.module';
import { AppRenderersModule } from '../app-renderers/app-renderers.module';

@NgModule({
    declarations: [
        ContainerComponent
    ],
    imports: [
        AppRenderersModule,
        FlexLayoutModule,
        CommonModule,
        MaterialModule
    ],
    exports: [
        ContainerComponent
    ]
})
export class OdysseusModule { }
