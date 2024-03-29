import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { CustomNodeComponent } from 'src/app/components/custom-node/custom-node.component';

@NgModule({
  imports: [WelcomeRoutingModule],
  declarations: [WelcomeComponent, CustomNodeComponent],
  exports: [WelcomeComponent],
})
export class WelcomeModule {}
