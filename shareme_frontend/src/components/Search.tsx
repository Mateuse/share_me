import React from 'react'

interface SearchProps {
    searchTerm: string,
    setSearchTerm: any
}

const Search = ({searchTerm, setSearchTerm}: SearchProps) => {
  return (
    <div>
      Search
    </div>
  )
}

export default Search
