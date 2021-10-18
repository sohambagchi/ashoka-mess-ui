import React, { Component } from "react";
import axios from 'axios';

import Select from 'react-select';

import apiURL from '../../config';

import { ReactComponent as LoadingIcon } from '../../static/pacman.svg'


const api = axios.create({
    baseURL: apiURL.url
})

class FeedbackForm extends Component {
    state = {
        date: null,
        loading: true,
        userID: null,
        menu: null,
        meal: null,
        eatenItems: [],
    }

    constructor() {
        super();
        const today = new Date();
        const mealTimes_ = this.setMealTimes();

        today.setHours(13)
        today.setMinutes(10)

        const currentMealTime = this.getMeal(mealTimes_, today);

        today.setMonth(8)
        today.setDate(15)

        
        const todayDate = String(today.getFullYear()) + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

        console.log(today, todayDate, currentMealTime)

        if (currentMealTime != null) {
            api.get('/nowMenu', {
                params: {
                    date: todayDate,
                    meal: currentMealTime,
                }
            }).then(res => {
                this.setState({ menu: res.data, loading: false, date: today, meal: currentMealTime }, () => {
                    console.log(this.state)
                })
            }).catch((err) => console.log(err))
        } else {
            this.setState({ menu: null, loading: false }, () => {
                console.log("set null menu")
            })
        }
    }

    setMealTimes () {
        var breakfastStart = new Date();
            breakfastStart.setHours(8);
            breakfastStart.setMinutes(0);
        var breakfastEnd = new Date();
            breakfastEnd.setHours(11);
            breakfastEnd.setMinutes(0);
        var lunchStart = new Date();
            lunchStart.setHours(12);
            lunchStart.setMinutes(15);
        var lunchEnd = new Date();
            lunchEnd.setHours(15);
            lunchEnd.setMinutes(0);
        var snacksStart = new Date();
            snacksStart.setHours(16);
            snacksStart.setMinutes(45);
        var snacksEnd = new Date();
            snacksEnd.setHours(18);
            snacksEnd.setMinutes(30);
        var dinnerStart = new Date();
            dinnerStart.setHours(19);
            dinnerStart.setMinutes(30);
        var dinnerEnd = new Date();
            dinnerEnd.setHours(22);
            dinnerEnd.setMinutes(30);
        
        return {
            breakfastStart: breakfastStart,
            breakfastEnd  : breakfastEnd,
            lunchStart    : lunchStart,
            lunchEnd      : lunchEnd,
            snacksStart   : snacksStart,
            snacksEnd     : snacksEnd,
            dinnerStart   : dinnerStart,
            dinnerEnd     : dinnerEnd
        }
    }

    getMeal (mealTimes, today) {
        if (today > mealTimes.breakfastStart && today < mealTimes.breakfastEnd) {
            return "Breakfast";
        } else if (today > mealTimes.lunchStart && today < mealTimes.lunchEnd) {
            return "Lunch";
        } else if (today > mealTimes.snacksStart && today < mealTimes.snacksEnd) {
            return "Snacks";
        } else if (today > mealTimes.dinnerStart && today < mealTimes.dinnerEnd) {
            return "Dinner";
        } else {
            return null;
        }
    }

    render () {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        var foodFeedbackCard;

        if (this.state.eatenItems.length > 0) {
            foodFeedbackCard = 
                <div class='container'>
                    <div class='card my-4'>
                        <div class='card-header'>
                            <p class='card-header-title'>
                                Food Feedback
                            </p>
                        </div>
                        <div class='card-content'>
                            <div class='form'>
                                <div class='rows'>
                                    { this.state.eatenItems.map(eatenItem => 
                                        <div class='row'>
                                            <div class='columns'>
                                                <div class='column'>
                                                    {eatenItem.value}
                                                </div>
                                                <div class='column'>
                                                    <input class='input' type='text' placeholder={eatenItem.value}/>    
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
        } else {
            foodFeedbackCard = <div></div>;
        }

        if (this.state.loading) {
            return (
                <div class='section'>
                    <div class='container'>
                        <div class='card'>
                            <div class='card-header'>
                                <p class='card-header-title'>
                                    Feedback for 
                                </p>
                            </div>
                            <div class='card-content'>
                                <LoadingIcon />
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            if (this.state.menu == null) {
                return (
                    <div class='section'>
                        <div class='container'>
                            <div class='card'>
                                <div class='card-header'>
                                    <p class='card-header-title'>
                                        Feedback for 
                                    </p>
                                </div>
                                <div class='card-content'>
                                    Come back at another time!          
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else {
                var self = this;
                return (
                    <div class='section'>
                        <div class='container'>
                            <div class='card'>
                                <div class='card-header'>
                                    <p class='card-header-title'>
                                        Feedback for { days[this.state.date.getDay()] } { this.state.meal }
                                    </p>
                                </div>
                                <div class='card-content'>
                                    <div class='form'>
                                        <div class='rows'>
                                            <div class='row'>
                                                <Select 
                                                    isMulti
                                                    options={ this.state.menu }
                                                    name="menu"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    onChange = { (menuChoices) => {
                                                        self.setState({
                                                            eatenItems: menuChoices
                                                        })
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        { foodFeedbackCard }
                    </div>
                )
            }
        }
    }
}

export default FeedbackForm;