export const bodyContent = `
<header>
    <nav>
        <a href="#buttons">Buttons</a>
        <a href="#links">Links</a>
        <a href="#inputs">Inputs</a>
    </nav>
</header>
<main>
    <h1>Test Page</h1>

    <section aria-labelledby="buttons">
        <h2 id="buttons">Buttons</h2>

        <button>Real Button</button>

        <button disabled>Disabled Button</button>

        <button type="button">
            <span><em>Fancy</em> Button</span>
        </button>

        <div role="button" tabindex="0">Fake Button</div>

        <div class="tabs">
            <div role="tablist" aria-label="Sample Tabs">
                <button role="tab" type="button" aria-selected="true" aria-controls="panel-1" id="tab-1" tabindex="0">
                    First Tab
                </button>
                <button role="tab" type="button" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">
                    Second Tab
                </button>
                <button role="tab" type="button" aria-selected="false" aria-controls="panel-3" id="tab-3" tabindex="-1">
                    Third Tab
                </button>
            </div>
            <div id="panel-1" role="tabpanel" tabindex="0" aria-labelledby="tab-1">
                <p>Content for the first panel</p>
            </div>
            <div id="panel-2" role="tabpanel" tabindex="0" aria-labelledby="tab-2" hidden>
                <p>Content for the second panel</p>
            </div>
            <div id="panel-3" role="tabpanel" tabindex="0" aria-labelledby="tab-3" hidden>
                <p>Content for the third panel</p>
            </div>
        </div>

        <input type="button" value="Input Button" />

        <input type="submit" value="Submit Button" />

        <button>0<span>1<span>2<span>3<span>4<span>5<span>6<span>7</span></span></span></span></span></span></span></button>

    </section>


    <section aria-labelledby="links">
        <h2 id="links">Links</h2>

        <a>Link without href</a>

        <a href="/foo"><span>Real</span> Link</a>

        <a href="mailto:alice@email.com" aria-label="email alice">Ask a question</a>

        <a href="/foo">
            <img src="/media/cc0-images/grapefruit-slice-332-332.jpg" alt="Grapefruit">
        </a>

    </section>


    <section aria-labelledby="inputs">
        <h2 id="inputs">Inputs</h2>

        <form>
            <div>
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name">
            </div>

            <div>
                <label for="age">Age</label>
                <input type="number" id="age" name="age">
            </div>

            <div>
                <input type="checkbox" id="subscribeNews" name="subscribe" value="newsletter" />
                <label for="subscribeNews">Subscribe to newsletter?</label>
            </div>

            <fieldset>
                <legend>Choose your interests</legend>
                <div>
                    <input type="checkbox" id="coding" name="interest" value="coding" />
                    <label for="coding">Coding</label>
                </div>
                <div>
                    <input type="checkbox" id="music" name="interest" value="music" />
                    <label for="music">Music</label>
                </div>
            </fieldset>

            <fieldset>
                <legend>Select a maintenance drone:</legend>
                <div>
                    <input type="radio" id="huey" name="drone" value="huey" checked>
                    <label for="huey">Huey</label>
                </div>
                <div>
                    <input type="radio" id="dewey" name="drone" value="dewey">
                    <label for="dewey">Dewey</label>
                </div>
                <div>
                    <input type="radio" id="louie" name="drone" value="louie">
                    <label for="louie">Louie</label>
                </div>
            </fieldset>

            <div>
                <label for="pet-select">Choose a pet</label>
                <select name="pets" id="pet-select">
                    <option value="">--Please choose an option--</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="hamster">Hamster</option>
                    <option value="parrot">Parrot</option>
                    <option value="spider">Spider</option>
                    <option value="goldfish">Goldfish</option>
                </select>
            </div>

        </form>

        <section aria-labelledby="fake-inputs">
            <h2 id="fake-inputs">Fake Inputs</h2>

            <div>
                <span role="checkbox" aria-checked="false" tabindex="0" aria-labelledby="chk1-label"></span>
                <label id="chk1-label">Remember my preferences</label>
            </div>

            <div role="radiogroup" aria-labelledby="gdesc1">
                <h3 id="gdesc1">Pizza Crust</h3>
                <div id="rb1" role="radio" aria-checked="false" tabindex="-1">
                    Regular crust
                </div>

                <div id="rb2" role="radio" aria-checked="false" tabindex="-1">
                    Deep dish
                </div>
            </div>

            <div>
                <label id="combo1-label" class="combo-label">Favorite Fruit</label>
                <div aria-activedescendant="" aria-controls="listbox1" aria-expanded="false" aria-haspopup="listbox"
                    aria-labelledby="combo1-label" role="combobox" tabindex="0">
                    Apple
                </div>
                <div class="combo-menu" role="listbox" id="listbox1" aria-labelledby="combo1-label" tabindex="-1">
                    <div role="option" aria-selected="false">Choose a Fruit</div>
                    <div role="option" aria-selected="true">Apple</div>
                    <div role="option" aria-selected="false">Banana</div>
                    <div role="option" aria-selected="false">Blueberry</div>
                    <div role="option" aria-selected="false">Boysenberry</div>
                    <div role="option" aria-selected="false">Cherry</div>
                    <div role="option" aria-selected="false">Cranberry</div>
                    <div role="option" aria-selected="false">Durian</div>
                    <div role="option" aria-selected="false">Eggplant</div>
                    <div role="option" aria-selected="false">Fig</div>
                    <div role="option" aria-selected="false">Grape</div>
                    <div role="option" aria-selected="false">Guava</div>
                    <div role="option" aria-selected="false">Huckleberry</div>
                </div>
            </div>

        </section>

    </section>
</main>
<footer>
    <a href="#top">back to top</a>
</footer>
`;
