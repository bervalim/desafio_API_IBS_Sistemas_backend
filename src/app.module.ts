import { Module } from '@nestjs/common';

import { PeopleModule } from './modules/people/people.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PeopleModule, AddressesModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
