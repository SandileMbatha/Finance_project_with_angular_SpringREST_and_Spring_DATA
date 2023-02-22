import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PropertyBondRoutingModule } from './property-bond-routing.module';
import { CreatePropertyBondComponent } from './create-property-bond/create-property-bond.component';
import { UpdatePropertyBondComponent } from './update-property-bond/update-property-bond.component';
import { SharedModule } from '../shared.module';
@NgModule({
  declarations: [CreatePropertyBondComponent, UpdatePropertyBondComponent],
  imports: [CommonModule, ReactiveFormsModule, PropertyBondRoutingModule, SharedModule],
})
export class PropertyBondModule {}
