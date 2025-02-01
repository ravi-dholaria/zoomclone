# Turing-Test


### 1. src


### 2. Components

<details open><summary><b>

#### Header.js
</b></summary>

**E:\Node\Turing-Test\turing-react.js-challenge\src\src\Components\Header.js**
```Typescript
import React from "react";

const Header = ({ isSyncing, sync, search, onFilter }) => (
  <div className='contactInfoHeaderWrapper'>
    <div>Car Dashboard</div>
    <div>
      <input onChange={onFilter} value={search} />
    </div>
    <div>
      <button disabled={isSyncing} onClick={sync}>
        {isSyncing ? "Syncing" : "Sync"}
      </button>
    </div>
  </div>
);

export default Header;

```

</details>
<details open><summary><b>

#### Paginator.js
</b></summary>

**E:\Node\Turing-Test\turing-react.js-challenge\src\src\Components\Paginator.js**
```Typescript
import React from 'react';

const Paginater = ({
  totalPages,
  hasPrevPage,
  prevPage,
  hasNextPage,
  nextPage,
  page,
}) =>
  page != totalPages ? (
    <div className="contactInfoPaginatorWrapper">
      <div>
        Page {page} of {totalPages}
      </div>
      <div>
        <button disabled={hasPrevPage} onClick={prevPage}>
          prev
        </button>
        <button disabled={hasNextPage} onClick={nextPage}>
          next
        </button>
      </div>
    </div>
  ) : (
    <></>
  );

export default Paginater;

```

</details>
<details open><summary><b>

#### UserContact.js
</b></summary>

**E:\Node\Turing-Test\turing-react.js-challenge\src\src\Components\UserContact.js**
```Typescript
import React from 'react';

const UserContact = ({ listId, info }) => (
    <div className='contactInfoWrapper' id={info?.id}>
        <div className='contactInfoThumbnail'>
            {info?.thumbnail && <img className='avatar' src={info?.thumbnail} alt='Avatar' />}
        </div>
        <div className='contactInfoText'>
            {info?.name && <p className='name'>{info?.name}</p>}
            {info?.phone && <p>{info?.phone}</p>}
        </div>
    </div>
);

export default UserContact;

```

</details>
<details open><summary><b>

#### UserContactList.js
</b></summary>

**E:\Node\Turing-Test\turing-react.js-challenge\src\src\Components\UserContactList.js**
```Typescript
import React from 'react';
import ContactInfo from './UserContact';

const UserContactList = ({ listId, contactList }) => (
  <>
    {contactList.map((contact) => (
      <ContactInfo
        key={contact.id}
        info={contact}
      />
    ))}
  </>
);
export default UserContactList;

```

</details>

### 3. CustomHooks

<details open><summary><b>

#### useContactList.js
</b></summary>

**E:\Node\Turing-Test\turing-react.js-challenge\src\src\CustomHooks\useContactList.js**
```Typescript
import { useState, useRef } from 'react';
import BluetoothSyncAPI from '../../Services/BluetoothSyncAPI.Service.V2';

/**
 * Custom React Hook responsible for sync with the Car's Bluetooth API
 */
const useContactList = () => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [syncError, setSyncError] = useState('');
  const [search, setSearch] = useState('');
  const count = useRef(5);
  /**
   * Call next page
   */
  const nextPage = () => {
    /**
     * if the offset plus count is less than the length of the list
     * set offset + count
     * update the offest to trigger a re-render
     **/
    setOffset((offset) => {
      const nextOffset = offset + count.current;
      if (nextOffset < filteredList.length) {
        return nextOffset;
      }
      return offset;
    });
  };
  /**
   * Call previous page
   */
  const prevPage = () => {
    /**
     * if offset  less count greater than 0
     * set offset - count
     * update the offest to trigger a re-render
     *
     */
    setOffset((offset) => {
      const prevOffset = offset - count.current;
      if (prevOffset > -1) {
        return prevOffset;
      }
      return offset;
    });
  };
  /**
   *
   */
  const onFilter = (event) => {
    /**
     * if offset  less count greater than 0
     * set offset - count
     * update the offest to trigger a re-render
     *
     */
    const value = event.target.value;
    const filteredList = list.filter((item) =>
      [item.name, item.email].some((i) => i.includes(value))
    );
    setFilteredList(filteredList);
    setOffset(0);
    setSearch(value);
  };

  /**
   * Call the Bluetooth API and update the list
   */
  const sync = async () => {
    let users;
    setIsSyncing(true);
    setSyncError('');
    setSearch('');
    try {
      users = await BluetoothSyncAPI.sync();
    } catch (error) {
      users = [];
      setSyncError(error.message);
    }
    setList(users);
    setFilteredList(users);
    setIsSyncing(false);
    setOffset(0);
  };
  /**
   * Return the necessary functions
   */
  return {
    // Full list
    contactList: list,
    // Current page list
    currentPageList: filteredList.slice(offset, offset + count.current),
    // function used to sync with the Bluetooth API
    sync,
    // function to move the poiter to the next page
    nextPage,
    // function to mobe the pointer to the previous page
    prevPage,
    // variable that holds the value to indicate if the next page will be available or not
    hasNextPage: !(offset + count.current < filteredList.length),
    // variable that holds the value to indicate if the previous page will be available or not
    hasPrevPage: offset < count.current,
    // holds the value is the api is syncing or not
    isSyncing,
    // Current page number
    page: offset > 0 ? offset / count.current : offset,
    // Current page number
    totalPages: Math.ceil(filteredList.length / count.current),
    // The total os records
    total: filteredList.length,
    //
    onFilter,
    syncError,
    search,
  };
};

export default useContactList;

```

</details>
<details open><summary><b>

#### useContactList1.js
</b></summary>

**E:\Node\Turing-Test\turing-react.js-challenge\src\src\CustomHooks\useContactList1.js**
```Typescript
import React, { useState, useEffect, useRef } from 'react';
import BluetoothSyncAPI from '../../Services/BluetoothSyncAPI.Service.V2';
const useContactList1 = () => {
  const count = useRef(5);
  const [list, setList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [syncError, setSyncError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [filteredList, setFilteredList] = useState([]);

  const sync = async () => {
    let users = [];
    setSyncError('');
    setIsSyncing(true);

    try {
      users = await BluetoothSyncAPI.sync();
    } catch (error) {
      users = [];
      setSyncError(error.message);
    }
    setList(users);
    setFilteredList(users);
    setIsSyncing(false);
  };

  const nextPage = () =>
    setOffset((offset) => {
      const nextOffset = count.current + offset;
      return nextOffset < filteredList.length ? nextOffset : offset;
    });

  const prevPage = () =>
    setOffset((offset) => {
      const prevOffset = offset - count.current;
      return prevOffset > -1 ? prevOffset : offset;
    });

  const onFilter = (event) => {
    const value = event.target.value;
    const filteredList = list.filter((c) =>
      [c.name, c.email].some((name_or_email) => name_or_email.includes(value))
    );
    setFilteredList(filteredList);
    setOffset(0);
    setSearch(value);
  };

  return {
    //#region list's
    contactList: list,
    currentPageList: filteredList.slice(offset, offset + count.current),
    //#endregion

    //#region Syncing the data
    sync,
    isSyncing,
    syncError,
    //#endregion

    //#region Filter
    onFilter,
    search,
    //#endregion

    //#region Paginator
    prevPage,
    nextPage,
    hasPrevPage: offset < count.current,
    hasNextPage: !(offset + count.current < filteredList.length),
    total: filteredList.length,
    page: offset > 0 ? offset / count.current : offset,
    totalPages: Math.ceil(filteredList.length / count.current),
    //#endregion
  };
};

export default useContactList1;

```

</details>
