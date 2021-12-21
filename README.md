# createRGBE
 
create\update and synchronize Role DI OG Entity

- start object : GET_ENTITY_QUEUE
- Entity: {
-           entityType: 'tamarz',
-           identityCard: '7235111',
-           goalUserId: 'm72351',
-           personalNumber: '723519',
-           firstName: 'Janelle',
-           lastName: 'Mosciski',
-           akaUnit: 'gondor',
-           rank: 'mega',
-           job: 'Corporate Division Strategist',
-           clearance: 5,
-           mobilePhone: '0534724983',
-         };
-
- start object: GET_RGB_QUEUE
- RGB: {
-        "og": {
-            "name": "reprehenderit",
-            "source": "city_name",
-            "hierarchy": "wallmart/distinctio",
-            "status": "active"
-        },
-        "di": {
-            "type": "domUser",
-            "source": "city_name",
-            "uniqueId": "e38313586@city.com",
-            "entityId": "81946999",
-            "isRoleAttachable": true
-        },
-        "role": {
-            "roleId": "e38313586@city",
-            "jobTitle": "Investor Brand Associate",
-            "digitalIdentityUniqueId": "e38313586@city.com",
-            "hierarchy": "wallmart/distinctio/reprehenderit",
-            "source": "city_name"
-        }
-      }
-
- End point: create/update object in kartoffel 
- 
