# createRGBE

create\update and synchronize Role DI OG & Entity

Take the builded object that ready to kartoffel and check which action need to do
create new one / update exist / delete last and insert new ...

This service must to get object that good for kartoffel.

QUEUES

- buildEntity --> createRGBE: CREATE_RGBE_ENTITY_QUEUE
- buildROGD --> createRGBE(normal flow): CREATE_RGBE_ROGD_QUEUE
- buildROGD --> createRGBE(Mir flow): CREATE_RGBE_ROGD_MIR_QUEUE

- start object : GET_ENTITY_QUEUE
```
  Entity: {
            entityType: 'tamarz',
            identityCard: '7235111',
            goalUserId: 'm72351',
            personalNumber: '723519',
            firstName: 'Janelle',
            lastName: 'Mosciski',
            akaUnit: 'gondor',
            rank: 'mega',
            job: 'Corporate Division Strategist',
            clearance: 5,
            mobilePhone: '0534724983',
          };
 ```
  start object: GET_RGB_QUEUE
  ```
  RGB: {
         "og": {
             "name": "reprehenderit",
             "source": "city_name",
             "hierarchy": "wallmart/distinctio",
             "status": "active"
         },
         "di": {
             "type": "domUser",
             "source": "city_name",
             "uniqueId": "e38313586@city.com",
             "entityId": "81946999",
             "isRoleAttachable": true
         },
         "role": {
             "roleId": "e38313586@city",
             "jobTitle": "Investor Brand Associate",
             "digitalIdentityUniqueId": "e38313586@city.com",
             "hierarchy": "wallmart/distinctio/reprehenderit",
             "source": "city_name"
         }
       }
 ```
  start object: MIR_QUEUE
  ```
  RGB: {
         "og":null,
         "di": {
             "type": "domUser",
             "source": "city_name",
             "uniqueId": "e38313586@city.com",
             "entityId": "81946999",
             "isRoleAttachable": true
         },
         "role":null
         "identifiers": {
             // minimum 1 of 3 max 2
             "personalNumber": "14685465",
             "identityCard": "5465434",
             "goalUserId": "e38313586@city.com",
         }
       }
 ```
  End point: create/update object in kartoffel
 
