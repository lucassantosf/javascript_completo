import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import AppContainer from './AppContainer'
import { connect } from 'react-redux'
import { onAddSubmit } from '../actions'

const Add = (props)=>{
    const history = useHistory()    
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = async()=>{
        props.onAddSubmit(
            title,
            description,
            history
        )          
    }
  
    return (
        <AppContainer title="Add POST">
            <form>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" className="form-control" value={title} onChange={e=>setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea  className="form-control" value={description} onChange={e=>setDescription(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                    <button type="button" onClick={handleSubmit} disabled={props.loading} className="btn btn-success">
                        {props.loading ? 'Loaging' : 'Add'}
                    </button>
                </div>
            </form>
        </AppContainer>
    );
}

const mapStateToProps = (state)=>{
    return {
        loading: state.loading
    }
}

const mapActionToProps = {
    onAddSubmit
}

export default connect(mapStateToProps,mapActionToProps)(Add) 