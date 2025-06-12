# EncryptionModule

The `EncryptionModule` provides encryption facade that allow you to use it with multiple encryption strategies.
It uses `ConfigService` to manage encryption two methods encrypt and decrypt.

## usage

1. **Import to your target module**

   ```ts
   import { EncryptionModule } from '@app/global/encryption';
   import { Module } from '@nestjs/common';
   @Module({
     imports: [EncryptionModule],
     providers: [],
   })
   export class YourModule {}
   ```

2. **Use in your target module service**

- inject `EncryptionService` with your strategy token `@Inject(AnotherEncryptionStrategy.name)`

  ```ts
  import { EncryptionModule } from '@app/global/encryption';
  import { Injectable, Inject } from '@nestjs/common';
  import { AesEncryptionStrategy } from '@app/global/encryption/strategies';
  import { AnotherEncryptionStrategy } from '@app/global/encryptionstrategies';
  @Injectable()
  export class YourModuleService {
    constructor(
      @Inject(AesEncryptionStrategy.name) private readonly aesEncryptionService: EncryptionService,
      @Inject(AnotherEncryptionStrategy.name) private readonly anotherEncryptionStrategy: EncryptionService,
      @Inject(NewEncryptionStrategy.name) private readonly newEncryptionStrategy: EncryptionService,
    ) {}
  }
  ```

- use `this.{YourEncryptionStrategyService}.encrypt()` and `this.{YourEncryptionStrategyService}.decrypt()`

  ```ts
  const aesEncryptedText = this.aesEncryptionService.encrypt('test');

  const anotherEncryptedText = this.anotherEncryptionStrategy.encrypt('test');

  const newEncryptedText = this.newEncryptionStrategy.encrypt('test');
  ```

- same for decrypt

## Create New Encryption Strategy

- you have the follwing folder structure for this module

  ```ts
  encryption
  ├── services
  ├── strategies
  │   ├── aes-encryption.strategy.ts
  │   ├── another-encryption.strategy.ts
  │   └── xxx-encryption.strategy.ts
  └── encryption.module.ts

  ```

- all you need is to crete a new file in `strategies` folder with your new strategy name and extends `EncryptionService` base class

  ```ts
  import { Injectable } from '@nestjs/common';
  import { EncryptionService } from '../services';
  @Injectable()
  export class NewEncryptionStrategy extends EncryptionService {
    constructor() {
      super();
    }
  }
  ```

- (optional) you can access the .env ENCRYPTION_KEY and reuse it in your new strategy class by inject it with `@Inject('ENCRYPTION_KEY')`

  ```ts
  import { Injectable, Inject } from '@nestjs/common';
  import { EncryptionService } from '../services';
  @Injectable()
  export class NewEncryptionStrategy extends EncryptionService {
    constructor(@Inject('ENCRYPTION_KEY') private readonly encryptionKey: string) {
      super();
    }
  }
  ```

## Register The New Encryption Strategy in EncryptionModule

- you have to register the new strategy in `EncryptionModule` to use it injectable in any serice that you want to use it

  ```ts
  @Module({
    imports: [ConfigModule],
    providers: [
      ....etc ,
      {
        // Injection token name
        provide: NewEncryptionStrategy.name,
        // your new strategy class
        useClass: NewEncryptionStrategy,
      },
    ],
    // remember to export it (the injection token name)
    exports: [NewEncryptionStrategy.name],
  })
  export class EncryptionModule {}
  ```

## Idea

- I applied Strategy pattern in this module to manage encryption with multiple strategies with same base service
- I know it's could be more simpler if i apply the Strategy pattern using normal instaintion ex:

  ```ts
  const aesEncryptionStrategy = new AesEncryptionStrategy();
  const readyToUserEncryptionService = new EncryptionService(aesEncryptionStrategy);
  readyToUserEncryptionService.encrypt('test');
  ...etc
  ```

- but. by using nestjs providers/injection i can create a singleton instance from each strategy and reuse it in any service without instantiong it every time.
