import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { CustomNodeComponent } from 'src/app/components/custom-node/custom-node.component';
import { Node1Component } from 'src/app/components/node1/node1.component';

@NgModule({
  imports: [WelcomeRoutingModule],
  declarations: [WelcomeComponent, CustomNodeComponent, Node1Component],
  exports: [WelcomeComponent],
})
export class WelcomeModule {}
