import React from 'react'

const Export = (props) => {

    const { resource } = props
    if (!resource) {
        console.log("Error");
        throw new NotFoundError(['You have to pass "recordId" to Delete Action',].join('\n'), 'Action#handler')
    }
    for (const p in resource.properties) {
      console.log(p);
    }
    console.log(resource);
    return (
      <div>Successfully exported</div>
    )
  }

export default Export